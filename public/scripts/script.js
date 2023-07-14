function randBetween(bottom, top) {
    return Math.floor(Math.random() * (top - bottom) + bottom);
}

function releaseChild(child, duration) {
    child.style.position = "fixed";
    child.style.visibility = "visible";
    let randomX = randBetween(5, 85);
    let randomY = randBetween(10, 80);
    child.style.transform = "none";
    child.style.transform = `translate(${randomX}vw, ${randomY}vh)`;
    setTimeout(() => {
        child.style.transform = "translateY(-500px)";
        child.style.position = "absolute";
        child.style.visibility = "hidden";
    }, 1000 * 60);
}

function releaseGay(num, spread, duration) {
    let container = document.getElementById("gay-container");
    let children = [...container.childNodes].filter((node) => node.nodeName != "#text").sort(() => Math.random() - 0.5);
    console.log(children);
    for (let child of children.slice(0, num)) {
        setTimeout(() => releaseChild(child, duration), Math.random() * spread);
    }
}