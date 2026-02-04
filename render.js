const BACKGROUND = "#000000"
const FOREGROUND = "#50FF50"
const SCALE = 800
const FPS = 60
const GAMEOBJ = penger;

const canvas = document.getElementById("myCanvas")
canvas.width = SCALE
canvas.height = SCALE
const ctx = canvas.getContext("2d")

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function project({x,y,z}) {
  return {
    x: (x/z),
    y: (y/z)
  }
}

function translateZ({x,y,z}, dz) {
  return {x, y, z: z+dz}
}

function rotateXZ({x,y,z}, theta) {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return {
    x: x*c - z*s,
    y,
    z: x*s + z*c
  }
}

function toScreen(p, s=SCALE) {
  return {
    x: ((p.x+1)/2)*s,
    y: (1-(p.y+1)/2)*s
  }
}

function line(p1, p2) {
  ctx.strokeStyle = FOREGROUND;
  ctx.lineWidth = 2;
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function point({x,y}) {
  const s = 20
  ctx.fillStyle = FOREGROUND
  ctx.fillRect(x-s/2, y-s/2, s, s)
}

let dz = 1
let theta = 0
let then = Date.now()
function frame() {
  const dt = 1/FPS
  theta += ((1/2)*Math.PI*dt)
  let elapsed = Date.now() - then
  if (elapsed <= (1000/FPS)) {
    requestAnimationFrame(frame)
    return
  }
  clear()
  const vertices = GAMEOBJ.vertices
  for (const face of GAMEOBJ.faces) {
    for (let i = 0; i < face.length; i++) {
      let [v1, v2] = [vertices[face[i]], vertices[face[(i+1)%face.length]]];
      let p1 = toScreen(
        project(translateZ(rotateXZ(v1, theta), dz))
      )
      let p2 = toScreen(
        project(translateZ(rotateXZ(v2, theta), dz))
      )
      line(p1, p2)
    }
  }
  requestAnimationFrame(frame)
  then = Date.now()
}

requestAnimationFrame(frame)

