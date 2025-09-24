const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraseBtn = document.getElementById("erase-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
ctx.lineCap = "round"; //선의 모양

ctx.lineWidth = lineWidth.value; //자바스크립트가 실행될때 input의 기본값으로 초기화(코드는 현재값으로 한번만 실행)
let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}
function startPainting() {
  isPainting = true;
}
function cancelPainting() {
  isPainting = false;
}
function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}
function onColorChange(event) {
  ctx.strokeStyle = event.target.value; //선색을 바꿔준다
  ctx.fillStyle = event.target.value; //채우기색상을 바꿔준다.
  ``;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}
function onModeClick() {
  if (isFilling) {
    //isFilling이 참이면 거짓으로 바꾸고, 버튼의 내용도 fill로 바꾼다.
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasCLick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraseClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Draw";
}

function onFIleChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file); //해당 파일의 브라우저 메모리 URL을 알아낼수있다.
  const image = new Image(); // <img src=""/>과 똑같다.
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}
function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save(); // ctx의 현재상태, 색상 스타일 등 모든 것을 저장한다.
    ctx.lineWidth = 1;
    ctx.font = "40px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore(); //저장해뒀던 상태로 돌아간다. 어떤 수정을 하던 저장 되지 않는다.
    // console.log(event.offsetX, event.offsetY); 마우스가 클릭한 canvas 내부좌표
  }
}
function onSaveClick() {
  const url = canvas.toDataURL(); //data를 URL로 인코딩해준다
  const a = document.createElement("a");
  a.href = url; //<a href="">
  a.download = "myDrawing.png";
  a.click();
}
canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove); // canvas.onmousemove = onMove
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasCLick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraseClick);
fileInput.addEventListener("change", onFIleChange);
saveBtn.addEventListener("click", onSaveClick);
