import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as dat from 'lil-gui'
import VertexShader from './shader/vertex.glsl'
import FragmentShader from './shader/fragment.glsl'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

/**
 * Loaders
 */
// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Objects
 */

const textMaterial = new THREE.MeshStandardMaterial({
    color: "white",
    roughness:0,
    metalness:0.85,
})

gltfLoader.load(
    "text.glb",
    (gltf) => {
        console.log(gltf)
        const text = gltf.scene.children.find(child => child.name == 'Text')
        text.material = textMaterial
        console.log(text.material)
        text.position.set(-5, 4, -2)
        scene.add(text)
    }
)


const parameters = {}
parameters.count = 100
parameters.speed = 1
parameters.amplitude = 2
parameters.frequency = 0.5
parameters.pointSize = 150
parameters.n = 3
parameters.speed = 0.5
let geometry = null
let material = null
let points = null
function generateWave() {
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
// Geometry
    geometry = new THREE.BufferGeometry()
    const position = new Float32Array(parameters.count * 3)
    
    const color = new Float32Array(parameters.count * 3)
    
    for(let i = 0; i < parameters.count * 3; i++) {
        let i3 = i * 3
        position[i3 + 0] = (i / parameters.count) * 20 - 10
        position[i3 + 1] = Math.sin(position[i3])
        position[i3 + 2] = 0
     
        color[i3 + 0] = Math.random()
        color[i3 + 1] = Math.random()
        color[i3 + 2] = Math.random()
    
    
    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3))
    geometry.setAttribute("randomColor", new THREE.BufferAttribute(color, 3))
// Material
    material = new THREE.ShaderMaterial({
        vertexShader:VertexShader,
        fragmentShader:FragmentShader,
        uniforms:{
            uTime: {value:0 },
            uN:{ value:parameters.n },
            uSpeed:{ value: parameters.speed },
            uAmplitude:{ value: parameters.amplitude },
            uFrequency:{ value: parameters.frequency },
            uPointSize:{ value: parameters.pointSize }
        },
        transparent:true,
        side:THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

// Points
    points = new THREE.Points(geometry, material)
    scene.add(points)

}

generateWave()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("white", 0.8)
ambientLight.position.set(-2, 5, -1)
const spotLight = new THREE.SpotLight("white", 15, 40, Math.PI / 4, 10, 0)
spotLight.position.set(-13, 5, 0)
spotLight.target.position.set(0, 5, -2)
scene.add(spotLight, ambientLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
camera.position.y = 0.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Debug
 */
gui.add(parameters, 'n').min(0).max(100).step(1).name("n").onFinishChange(generateWave)
gui.add(parameters, 'speed').min(0).max(100).step(0.01).name("pointSpeed").onFinishChange(generateWave)
gui.add(parameters, 'pointSize').min(0).max(500).step(0.01).name("pointSize").onFinishChange(generateWave)
gui.add(parameters, 'amplitude').min(0).max(20).step(0.01).name("Amplitude").onFinishChange(generateWave)
gui.add(parameters, 'frequency').min(0).max(10).step(0.01).name("Frequency").onFinishChange(generateWave)


gui.add(parameters, "count").min(0).max(1000).step(1).name('pointCount').onFinishChange(generateWave)
/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    points.material.uniforms.uTime.value = elapsedTime

    // Update objects


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()