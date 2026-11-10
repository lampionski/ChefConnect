const { test } = require("node:test")
const assert = require("node:assert/strict")
const { spawn } = require("node:child_process")
const mongoose = require("mongoose")
const User = require("../Schemas/UserSchema")
const Message = require("../Schemas/Message")
const sharp = require('sharp')

test("authentication, permissions, reservations, tasks and local contact", { timeout: 30000 }, async () => {
  const port = 32000 + Math.floor(Math.random() * 1000)
  const uri = `mongodb://127.0.0.1:27017/chefconnect_test_${process.pid}`
  const server = spawn(process.execPath, ["AuthServer.js"], {
    cwd: require("node:path").join(__dirname, ".."),
    env: { ...process.env, MONGO_URI: uri, PORT: String(port), ACCESS_TOKEN_SECRET: "test-secret-only" },
    stdio: "ignore",
  })
  const base = `http://127.0.0.1:${port}`
  const request = async (path, method = "GET", body, cookie) => fetch(base + path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const register = async (email) => {
    const response = await request("/register", "POST", { email, password: "Test1234!", fullname: email })
    assert.equal(response.status, 201)
  }
  const login = async (email, password = "Test1234!") => {
    const response = await request("/login", "POST", { email, password })
    assert.equal(response.status, 200)
    return response.headers.get("set-cookie").split(";")[0]
  }

  try {
    let ready = false
    for (let i = 0; i < 60; i++) {
      if (server.exitCode !== null) throw new Error("API failed to start")
      try { if ((await request("/get-categories")).ok) { ready = true; break } } catch { /* starting */ }
      await new Promise((resolve) => setTimeout(resolve, 150))
    }
    assert.equal(ready, true, "API starts only after MongoDB connects")
    await mongoose.connect(uri)
    await register("admin@example.test")
    await register("worker@example.test")
    await register("guest@example.test")
    assert.equal((await request("/register", "POST", { email: "GUEST@EXAMPLE.TEST", password: "Test1234!", fullname: "Duplicate" })).status, 400)
    await User.updateOne({ email: "admin@example.test" }, { role: "admin" })
    await User.updateOne({ email: "worker@example.test" }, { role: "worker" })
    const worker = await User.findOne({ email: "worker@example.test" })
    const adminCookie = await login("admin@example.test")
    const guestCookie = await login("guest@example.test")
    const workerCookie = await login("worker@example.test")
    const menu = { name: "Test dish", description: "Temporary", price: 12, category: "Салата" }
    assert.equal((await request("/add-menu-item", "POST", menu)).status, 401)
    assert.equal((await fetch(base + "/add-menu-item", { method: "POST", headers: { Origin: "https://untrusted.example", "Content-Type": "application/json" }, body: JSON.stringify(menu) })).status, 403)
    assert.equal((await request("/add-menu-item", "POST", menu, guestCookie)).status, 403)
    const added = await request("/add-menu-item", "POST", menu, adminCookie)
    assert.equal(added.status, 201)
    assert.equal((await request(`/delete-menu-item/${(await added.json())._id}`, "DELETE", undefined, adminCookie)).status, 200)

    const image = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#e35b2d' } }).png().toBuffer()
    const uploadForm = (file, type = 'image/png') => {
      const form = new FormData()
      for (const [key, value] of Object.entries(menu)) form.append(key, String(value))
      form.append('image', 'https://example.test/old.jpg')
      form.append('imageFile', new Blob([file], { type }), 'dish.png')
      return form
    }
    assert.equal((await fetch(base + '/add-menu-item', { method: 'POST', body: uploadForm(image) })).status, 401)
    assert.equal((await fetch(base + '/add-menu-item', { method: 'POST', headers: { Cookie: adminCookie }, body: uploadForm(Buffer.from('not an image')) })).status, 400)
    assert.equal((await fetch(base + '/add-menu-item', { method: 'POST', headers: { Cookie: adminCookie }, body: uploadForm(Buffer.alloc(5 * 1024 * 1024 + 1)) })).status, 413)
    const uploaded = await fetch(base + '/add-menu-item', { method: 'POST', headers: { Cookie: adminCookie }, body: uploadForm(image) })
    assert.equal(uploaded.status, 201)
    const uploadedItem = await uploaded.json()
    assert.match(uploadedItem.image, /^\/uploads\/menu\/[0-9a-f-]+\.webp$/)
    const servedImage = await fetch(base + uploadedItem.image)
    assert.equal(servedImage.status, 200)
    assert.equal((await sharp(Buffer.from(await servedImage.arrayBuffer())).metadata()).format, 'webp')
    const updated = await request(`/update-menu-item/${uploadedItem._id}`, 'PUT', { ...menu, image: 'https://example.test/new.jpg' }, adminCookie)
    assert.equal(updated.status, 200)
    assert.equal((await updated.json()).image, 'https://example.test/new.jpg')
    assert.equal((await fetch(base + uploadedItem.image)).status, 404)
    const replaced = await fetch(base + `/update-menu-item/${uploadedItem._id}`, { method: 'PUT', headers: { Cookie: adminCookie }, body: uploadForm(image) })
    assert.equal(replaced.status, 200)
    const replacementImage = (await replaced.json()).image
    assert.match(replacementImage, /^\/uploads\/menu\/[0-9a-f-]+\.webp$/)
    assert.equal((await fetch(base + replacementImage)).status, 200)
    assert.equal((await request(`/delete-menu-item/${uploadedItem._id}`, 'DELETE', undefined, adminCookie)).status, 200)
    assert.equal((await fetch(base + replacementImage)).status, 404)

    const future = new Date(); future.setDate(future.getDate() + 3)
    const date = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`
    assert.equal((await request("/reservation-request", "POST", { date: "2020-01-01", startHour: 12, people: 2 }, guestCookie)).status, 400)
    assert.equal((await request("/reservation-request", "POST", { date, startHour: 12, people: "2" }, guestCookie)).status, 400)
    assert.equal((await request("/reservation-request", "POST", { date, startHour: 12, people: 2 }, guestCookie)).status, 201)
    const reservations = await (await request("/admin/reservations", "GET", undefined, adminCookie)).json()
    const id = reservations[0]._id
    assert.equal((await request(`/admin/reservations/${id}`, "PUT", { status: "confirmed" }, adminCookie)).status, 200)
    assert.equal((await request(`/admin/reservations/${id}`, "PUT", { status: "confirmed" }, adminCookie)).status, 409)
    const guestMessages = await (await request("/messages", "GET", undefined, guestCookie)).json()
    assert.equal(guestMessages.length, 1)
    assert.equal(guestMessages[0].sender.fullname, "admin@example.test")
    assert.equal((await request(`/user/reservations/${id}/cancel`, "PUT", undefined, guestCookie)).status, 200)
    assert.equal((await request("/messages", "GET", undefined, guestCookie)).status, 200)
    assert.equal((await request("/reservation-request", "POST", { date, startHour: 13, people: 2 }, guestCookie)).status, 201)
    const secondId = (await (await request("/admin/reservations", "GET", undefined, adminCookie)).json()).find((entry) => entry.startHour === 13)._id
    assert.equal((await request(`/admin/reservations/${secondId}`, "PUT", { status: "confirmed" }, adminCookie)).status, 200)
    assert.equal((await request(`/admin/reservations/${secondId}`, "PUT", { status: "cancelled" }, adminCookie)).status, 200)
    assert.equal((await request(`/admin/reservations/${secondId}`, "PUT", { status: "cancelled" }, adminCookie)).status, 409)
    assert.equal((await (await request("/user/reservations", "GET", undefined, guestCookie)).json()).find((entry) => entry._id === secondId).status, "cancelled")

    const deadline = new Date(Date.now() + 86400000).toISOString()
    assert.equal((await request("/admin/assign-task", "POST", { workerId: worker.id, title: "Prepare", description: "Ready tables", deadline }, adminCookie)).status, 201)
    const task = await Message.findOne({ receiver: worker._id, type: "task" })
    assert.ok(task.deadline)
    assert.equal((await request(`/tasks/${task.id}/complete`, "PUT", undefined, workerCookie)).status, 200)
    assert.equal((await request(`/tasks/${task.id}/complete`, "PUT", undefined, workerCookie)).status, 200)
    assert.equal((await Message.findById(task.id)).status, "completed")
    assert.equal(await Message.countDocuments({ receiver: task.sender, title: "Задача изпълнена" }), 1)

    assert.equal((await request("/contact", "POST", { name: "Visitor", email: "visitor@example.test", message: "Hello" })).status, 201)
    assert.equal((await request("/admin/contact-messages")).status, 401)
    assert.equal((await (await request("/admin/contact-messages", "GET", undefined, adminCookie)).json()).length, 1)

    assert.equal((await request("/change-password", "POST", { currentPassword: "wrong", newPassword: "Changed123!" }, guestCookie)).status, 400)
    assert.equal((await request("/change-password", "POST", { currentPassword: "Test1234!", newPassword: "Changed123!" }, guestCookie)).status, 200)
    assert.equal((await request("/user-profile", "GET", undefined, guestCookie)).status, 401)
    await login("guest@example.test", "Changed123!")
  } finally {
    if (mongoose.connection.readyState === 1) { await mongoose.connection.dropDatabase(); await mongoose.disconnect() }
    server.kill()
  }
})
