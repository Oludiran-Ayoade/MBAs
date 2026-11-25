// Upload page: unsigned upload to Cloudinary, filed under course + week.
(function () {
  const select = document.getElementById("courseSelect");
  const weekSelect = document.getElementById("weekSelect");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const dzText = document.getElementById("dzText");
  const uploadBtn = document.getElementById("uploadBtn");
  const progress = document.getElementById("progress");
  const progressBar = document.getElementById("progressBar");
  const result = document.getElementById("result");
  const configNotice = document.getElementById("configNotice");

  select.innerHTML = COURSES.map(c =>
    `<option value="${c.tag}">${c.code} — ${c.title}</option>`
  ).join("");

  weekSelect.innerHTML = WEEKS.filter(w => w.n).map(w =>
    `<option value="${w.n}">Week ${w.n} · ${w.label}${w.note ? ` (${w.note})` : ""}</option>`
  ).join("");

  // Preselect course/week when arriving from a course page (?c=tag&w=n)
  const params = new URLSearchParams(location.search);
  if (params.get("c") && getCourse(params.get("c"))) select.value = params.get("c");
  const cur = currentWeek();
  weekSelect.value = params.get("w") || (cur && cur.n) || 1;

  if (CONFIG.CLOUD_NAME.startsWith("YOUR_")) {
    configNotice.innerHTML = `<div class="notice">Cloudinary isn't configured yet — add your cloud name + unsigned preset in <code>assets/js/config.js</code> (see README.md).</div>`;
  }

  let file = null;
  function setFile(f) {
    file = f;
    dzText.innerHTML = `<span class="dz-file">${f.name}</span><br><small>${(f.size / 1048576).toFixed(2)} MB — click to change</small>`;
    uploadBtn.disabled = false;
    result.style.display = "none";
  }

  dropzone.onclick = () => fileInput.click();
  fileInput.onchange = () => fileInput.files[0] && setFile(fileInput.files[0]);
  dropzone.ondragover = e => { e.preventDefault(); dropzone.classList.add("drag"); };
  dropzone.ondragleave = () => dropzone.classList.remove("drag");
  dropzone.ondrop = e => {
    e.preventDefault();
    dropzone.classList.remove("drag");
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  uploadBtn.onclick = () => {
    if (!file) return;
    const tag = select.value;
    const week = `w${weekSelect.value}`;
    const url = `https://api.cloudinary.com/v1_1/${CONFIG.CLOUD_NAME}/auto/upload`;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.UPLOAD_PRESET);
    fd.append("tags", `mba,${tag},${week}`);
    fd.append("folder", `mba-notes/${tag}/${week}`);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    uploadBtn.disabled = true;
    progress.style.display = "block";
    result.style.display = "none";

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) progressBar.style.width = (e.loaded / e.total) * 100 + "%";
    };
    xhr.onload = () => {
      uploadBtn.disabled = false;
      result.style.display = "block";
      if (xhr.status === 200) {
        result.className = "upload-result ok";
        result.innerHTML = `✅ Uploaded to Week ${weekSelect.value}! <a href="course.html?c=${tag}">See it on the ${getCourse(tag).code} page →</a>`;
      } else {
        result.className = "upload-result err";
        result.textContent = "Upload failed: " + (JSON.parse(xhr.responseText).error?.message || xhr.statusText);
      }
    };
    xhr.onerror = () => {
      uploadBtn.disabled = false;
      result.style.display = "block";
      result.className = "upload-result err";
      result.textContent = "Upload failed — check your connection and Cloudinary config.";
    };
    xhr.send(fd);
  };
})();
