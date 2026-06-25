

// let editId = null;
// let generatedPassword = "";

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("studentForm");
//   const tableCard = document.querySelector(".card-custom:last-child");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const name = document.getElementById("studName").value.trim();
//     const email = document.getElementById("studEmail").value.trim();
//     const course = document.getElementById("studCourse").value;

//     try {
//       if (!editId) {
//         const res = await fetch("http://localhost:4000/api/students", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             studentName: name,
//             studentEmail: email,
//             studentCourse: course,
//             studentPassword: generatedPassword
//           }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to create student");

//         console.log("Student created", data);

//       } else {
//         const res = await fetch(`http://localhost:4000/api/students/${editId}/update`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             studentName: name,
//             studentEmail: email,
//             studentCourse: course
//           }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to update student");

//         console.log("Student updated", data);
//         editId = null;
//       }

//       form.reset();
//       generatedPassword = "";
//       document.getElementById("passMsg").innerText = "";

//       await fetchStudents();
//       tableCard.scrollIntoView({ behavior: "smooth" });

//     } catch (err) {
//       console.error("Error:", err);
//       alert(err.message);
//     }
//   });

//   fetchStudents();
// });


// async function fetchStudents() {
//   try {
//     const res = await fetch("http://localhost:4000/api/students");
//     const data = await res.json();

//     if (!res.ok) throw new Error("Failed to fetch students");

//     const tbody = document.querySelector("tbody");
//     tbody.innerHTML = "";

//     data.forEach((student) => {
//       const tr = document.createElement("tr");
//       tr.dataset.id = student._id;

//       tr.innerHTML = `
//         <td>${student.studentName}</td>
//         <td>${student.studentEmail}</td>
//         <td>${student.studentCourse}</td>
//         <td><button class="btn btn-warning btn-sm update">Update</button></td>
//         <td><button class="btn btn-danger btn-sm delete">Delete</button></td>
//       `;

//       tbody.appendChild(tr);
//     });

//   } catch (err) {
//     console.error("Fetch students error:", err);
//     alert("Could not load students");
//   }
// }


// document.addEventListener("click", async (e) => {
//   const tr = e.target.closest("tr");
//   if (!tr) return;

//   if (e.target.classList.contains("update")) {
//     editId = tr.dataset.id;

//     document.getElementById("studName").value = tr.children[0].innerText;
//     document.getElementById("studEmail").value = tr.children[1].innerText;
//     document.getElementById("studCourse").value = tr.children[2].innerText;

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   if (e.target.classList.contains("delete")) {
//     const id = tr.dataset.id;
//     if (!confirm("Are you sure you want to delete this student?")) return;

//     try {
//       const res = await fetch(`http://localhost:4000/api/students/${id}/delete`, {
//         method: "DELETE"
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error("Delete failed");

//       console.log("Deleted", data);
//       tr.remove();

//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Could not delete student");
//     }
//   }
// });

// document.getElementById("generatePassBtn").addEventListener("click", () => {
//   const email = document.getElementById("studEmail").value.trim();

//   if (!email) {
//     alert("Please enter email first");
//     return;
//   }

//   generatedPassword = Math.random().toString(36).slice(-8);

//   document.getElementById("passMsg").innerText =
//     "Password Generated Successfully: " + generatedPassword;
// });
let editId = null;
let generatedPassword = "";

// Localhost aur Railway dono par same origin use hoga
const API_BASE_URL = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const tableCard = document.querySelector(".card-custom:last-child");

  if (!form) {
    console.error("studentForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("studName").value.trim();
    const email = document.getElementById("studEmail").value.trim();
    const course = document.getElementById("studCourse").value;

    if (!name || !email || !course) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (!editId) {
        const res = await fetch(`${API_BASE_URL}/api/students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: name,
            studentEmail: email,
            studentCourse: course,
            studentPassword: generatedPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to create student");
        }

        console.log("Student created", data);
        alert("Student created successfully");
      } else {
        const res = await fetch(`${API_BASE_URL}/api/students/${editId}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: name,
            studentEmail: email,
            studentCourse: course,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to update student");
        }

        console.log("Student updated", data);
        alert("Student updated successfully");
        editId = null;
      }

      form.reset();
      generatedPassword = "";
      document.getElementById("passMsg").innerText = "";

      await fetchStudents();

      if (tableCard) {
        tableCard.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Server not responding");
    }
  });

  fetchStudents();
});

async function fetchStudents() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch students");
    }

    const tbody = document.querySelector("tbody");

    if (!tbody) {
      console.error("tbody not found");
      return;
    }

    tbody.innerHTML = "";

    data.forEach((student) => {
      const tr = document.createElement("tr");
      tr.dataset.id = student._id;

      tr.innerHTML = `
        <td>${student.studentName}</td>
        <td>${student.studentEmail}</td>
        <td>${student.studentCourse}</td>
        <td><button class="btn btn-warning btn-sm update">Update</button></td>
        <td><button class="btn btn-danger btn-sm delete">Delete</button></td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Fetch students error:", err);
    alert("Could not load students");
  }
}

document.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;

  if (e.target.classList.contains("update")) {
    editId = tr.dataset.id;

    document.getElementById("studName").value = tr.children[0].innerText;
    document.getElementById("studEmail").value = tr.children[1].innerText;
    document.getElementById("studCourse").value = tr.children[2].innerText;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (e.target.classList.contains("delete")) {
    const id = tr.dataset.id;

    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${id}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      console.log("Deleted", data);
      tr.remove();
      alert("Student deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Could not delete student");
    }
  }
});

const generatePassBtn = document.getElementById("generatePassBtn");

if (generatePassBtn) {
  generatePassBtn.addEventListener("click", () => {
    const email = document.getElementById("studEmail").value.trim();

    if (!email) {
      alert("Please enter email first");
      return;
    }

    generatedPassword = Math.random().toString(36).slice(-8);

    document.getElementById("passMsg").innerText =
      "Password Generated Successfully: " + generatedPassword;
  });
}