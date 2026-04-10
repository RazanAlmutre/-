
// ===== صفحة نجاح مؤقتة =====
function showSuccessAndRedirect(name, nextPage, action = "Registration Successful! Redirecting...") {
  document.body.innerHTML = `
    <div style="
      width:100%;
      height:100vh;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      text-align:center;
      background:linear-gradient(135deg,#e9f1ff,#cfe0ff);
      font-family:'Poppins',sans-serif;">
      
      <h1 style="color:#1e3f7f;font-size:28px;font-weight:600;">
        Welcome, ${name} 🎉
      </h1>
      <p style="font-size:18px;color:#333;margin-top:10px;">
        ${action}
      </p>
    </div>
  `;
  // يحجز الوقت للانتقال بعد 3 ثواني
  setTimeout(() => { window.location.href = nextPage; }, 3000);
}

// ===== تسجيل المستخدم =====
function toggleForm(signupMode){
  document.getElementById("signupCard").style.display = signupMode?"block":"none";
  document.getElementById("loginCard").style.display = signupMode?"none":"block";
}
function signUpUser() {
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPassword").value.trim();
  const gender = document.getElementById("gender").value; // ← الجنس

  if (!email || !pass) return alert("املأ جميع الحقول");

  let users = JSON.parse(localStorage.getItem("ssp_users") || "[]");
  if (users.find(u => u.email === email)) return alert("هذا البريد مسجل مسبقاً");

  // نحفظ البيانات مع الجنس
  users.push({ email, pass, gender });
  localStorage.setItem("ssp_users", JSON.stringify(users));
  localStorage.setItem("ssp_currentUser", email);

  const name = email.split("@")[0];
  showSuccessAndRedirect(name, "dashboard.html", "تم إنشاء الحساب بنجاح! سيتم نقلك بعد لحظات...");
}




function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  const users = JSON.parse(localStorage.getItem("ssp_users") || "[]");
  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) return alert("بيانات غير صحيحة");

  localStorage.setItem("ssp_currentUser", email);

  // ✨ صفحة الترحيب تظهر هنا
  const name = email.split('@')[0];
  showSuccessAndRedirect(name, "dashboard.html", "Welcome back! Redirecting...");
}



function logoutUser(){localStorage.removeItem("ssp_currentUser");window.location.href="signUp.html";}
function requireLogin(){if(!localStorage.getItem("ssp_currentUser"))window.location.href="signUp.html";}


// ===== Courses =====
function addCourse(){
  const name=document.getElementById("courseName").value.trim();
  const hrs=parseFloat(document.getElementById("creditHours").value)||0;
  if(!name)return alert("أدخل اسم المقرر");
  let list=JSON.parse(localStorage.getItem("ssp_courses")||"[]");
  list.push({id:Date.now(),name,hrs});
  localStorage.setItem("ssp_courses",JSON.stringify(list));
  loadCourses();
}
function deleteCourse(id){
  let list=JSON.parse(localStorage.getItem("ssp_courses")||"[]");
  list=list.filter(c=>c.id!==id);
  localStorage.setItem("ssp_courses",JSON.stringify(list));
  loadCourses();
}
function loadCourses(){
  requireLogin();
  const body=document.getElementById("courseBody");
  const list=JSON.parse(localStorage.getItem("ssp_courses")||"[]");
  body.innerHTML="";
  list.forEach((c,i)=>{
    body.innerHTML+=`<tr><td>${i+1}</td><td>${c.name}</td><td>${c.hrs}</td>
    <td><button class='btn-delete' onclick='deleteCourse(${c.id})'>❌</button></td></tr>`;
  });
  localStorage.setItem("ssp_totalCourses",list.length);
}

// ===== Deadlines =====
function addDeadline(){
  const type=document.getElementById("deadlineType").value;
  const course=document.getElementById("deadlineCourse").value.trim();
  const name=document.getElementById("deadlineName").value.trim();
  const date=document.getElementById("deadlineDate").value;
  if(!course||!name||!date)return alert("املأ كل الحقول");
  let list=JSON.parse(localStorage.getItem("ssp_deadlines")||"[]");
  list.push({id:Date.now(),type,course,name,date});
  localStorage.setItem("ssp_deadlines",JSON.stringify(list));
  loadDeadlines();
}
function deleteDeadline(id){
  let list=JSON.parse(localStorage.getItem("ssp_deadlines")||"[]");
  list=list.filter(d=>d.id!==id);
  localStorage.setItem("ssp_deadlines",JSON.stringify(list));
  loadDeadlines();
}
function loadDeadlines(){
  requireLogin();
  const body=document.getElementById("deadlineBody");
  const list=JSON.parse(localStorage.getItem("ssp_deadlines")||"[]");
  body.innerHTML="";
  list.forEach(d=>{
    const daysLeft=Math.ceil((new Date(d.date)-new Date())/(1000*60*60*24));
    body.innerHTML+=`<tr><td>${d.type}</td><td>${d.course}</td><td>${d.name}</td>
    <td>${d.date}</td><td>${daysLeft>0?daysLeft:"0"}</td>
    <td><button class='btn-delete' onclick='deleteDeadline(${d.id})'>❌</button></td></tr>`;
  });
  localStorage.setItem("ssp_totalDeadlines",list.length);
}

// ===== Availability =====
function loadAvailability(){
  requireLogin();
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const table=document.getElementById("availabilityTable");
  table.innerHTML="";
  const data=JSON.parse(localStorage.getItem("ssp_availability")||"{}");
  days.forEach(d=>{
    table.innerHTML+=`<tr><td>${d}</td><td><input id="${d}" type="number" min="0" value="${data[d]||0}"></td></tr>`;
  });
}
function saveAvailability(){
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let total=0, obj={};
  days.forEach(d=>{
    const val=parseFloat(document.getElementById(d).value)||0;
    obj[d]=val; total+=val;
  });
  localStorage.setItem("ssp_availability",JSON.stringify(obj));
  localStorage.setItem("ssp_totalHours",total);
  alert("تم الحفظ ("+total+" ساعات)");
}

// ===== Dashboard =====
function loadDashboard(){
  requireLogin();
  const totalHours=localStorage.getItem("ssp_totalHours")||0;
  document.getElementById("weeklyHours").textContent=totalHours+"h";
  document.getElementById("totalCourses").textContent=localStorage.getItem("ssp_totalCourses")||0;
  document.getElementById("totalDeadlines").textContent=localStorage.getItem("ssp_totalDeadlines")||0;
  const percent=Math.min((totalHours/40)*100,100);
  document.getElementById("weeklyProgressBar").style.width=percent+"%";
  document.getElementById("weeklyProgressText").textContent=percent.toFixed(0)+"%";
}

// ===== Statistics =====
function loadStatistics(){
  requireLogin();
  const body=document.getElementById("statsBody");
  const avail=JSON.parse(localStorage.getItem("ssp_availability")||"{}");
  body.innerHTML="";
  Object.keys(avail).forEach(day=>{
    const hrs=avail[day];
    const status=hrs>0?"✅":"—";
    body.innerHTML+=`<tr><td>${day}</td><td>${hrs}</td><td>${status}</td></tr>`;
  });
}













