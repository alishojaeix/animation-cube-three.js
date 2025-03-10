// تنظیمات اولیه
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ایجاد چندین مکعب
const cubes = [];
const numCubes = 10; // تعداد مکعب‌ها
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

for (let i = 0; i < numCubes; i++) {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;
    cubes.push(cube);
    scene.add(cube);
}

// موقعیت دوربین
camera.position.z = 15;

// تابع برای ایجاد موقعیت تصادفی
function getRandomPosition() {
    return {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10
    };
}

// تابع برای حرکت نرم مکعب‌ها به موقعیت جدید
function moveCubes() {
    cubes.forEach(cube => {
        const newPosition = getRandomPosition();
        new TWEEN.Tween(cube.position)
            .to(newPosition, 2000) // مدت زمان انیمیشن (2 ثانیه)
            .easing(TWEEN.Easing.Quadratic.Out) // نوع انیمیشن
            .start(); // شروع انیمیشن
    });
}

// ایجاد خطوط برای تار عنکبوتی
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const lines = [];

// تابع برای ایجاد خطوط بین مکعب‌ها
function createSpiderWeb() {
    // حذف خطوط قبلی
    lines.forEach(line => scene.remove(line));
    lines.length = 0;

    // ایجاد خطوط جدید
    for (let i = 0; i < cubes.length; i++) {
        for (let j = i + 1; j < cubes.length; j++) {
            const points = [];
            points.push(cubes[i].position);
            points.push(cubes[j].position);

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            lines.push(line);
            scene.add(line);
        }
    }
}

// تابع برای به‌روزرسانی خطوط
function updateLines() {
    lines.forEach(line => {
        line.geometry.setFromPoints([line.geometry.attributes.position.array[0], line.geometry.attributes.position.array[1]]);
        line.geometry.attributes.position.needsUpdate = true;
    });
}

// تابع انیمیشن
function animate() {
    requestAnimationFrame(animate);

    // به‌روزرسانی Tween.js
    TWEEN.update();

    // به‌روزرسانی خطوط تار عنکبوتی
    createSpiderWeb();

    // رندر صحنه
    renderer.render(scene, camera);
}

// شروع انیمیشن
animate();

// حرکت مکعب‌ها هر 3 ثانیه
setInterval(moveCubes, 3000);

// مدیریت تغییر اندازه پنجره
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});