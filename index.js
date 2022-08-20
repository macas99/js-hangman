const canvas = document.getElementById("canvas");

let current_word = "";
// window.onload = drawCanvas();

function requestWord() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://random-words-api.vercel.app/word/noun", false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText)[0].word;
}

function drawCanvas() {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';

    function drawLine(x1, y1, x2, y2) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    const frame1 = () => drawLine(60, 120, 140, 120);
    const frame2 = () => drawLine(100, 120, 100, 30);
    const frame3 = () => drawLine(100, 30, 180, 30);
    const frame4 = () => drawLine(180, 30, 180, 45);

    const head = () => {
        ctx.beginPath();
        ctx.arc(180, 55, 10, 0, 2 * Math.PI);
        drawLine(174, 60, 178, 60);
        drawLine(182, 60, 186, 60);
    };

    const body = () => {
        drawLine(171, 58, 170, 90);
        drawLine(189, 58, 190, 90);
        drawLine(170, 90, 190, 90);
    };

    const arm1 = () => drawLine(175, 67, 175, 80);
    const arm2 = () => drawLine(185, 67, 185, 80);
    const leg1 = () => drawLine(171, 90, 171, 105);
    const leg2 = () => drawLine(189, 90, 189, 105);

    return { frame1, frame2, frame3, frame4, head, body, arm1, arm2, leg1, leg2 };
}

document.addEventListener("keydown", function (event) {
    if (event.key === '1') {
        drawCanvas().frame1();
        drawCanvas().frame2();
        drawCanvas().frame3();
        drawCanvas().frame4();
        drawCanvas().head();
        drawCanvas().body();
        drawCanvas().arm1();
        drawCanvas().arm2();
        drawCanvas().leg1();
        drawCanvas().leg2();
        requestWord();
    }
});

$(".start-game").on("click", function () {
    $(this).attr("hidden", true);
    current_word = requestWord();
});