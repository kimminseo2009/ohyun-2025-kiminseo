const post_url = "http://crud.tlol.me/kimmj/posts";
let pagePointer = 0;
let currentPostId = null;
let currentPage = 1;
const pageSize = 5;
// post데이터를 받아서  모달에 내용추가 후 모달 화면에 출력 함수
const showModal = (post) => {
  currentPostId = post.id;
  document.querySelector("#modal-title").innerText = post.title;
  document.querySelector("#modal-content").innerText = post.content;
  document.querySelector("#post-modal").classList.add("show");
};
// 모달 화면을 숨김 쇼 삭제
const hideModal = () => {
  document.querySelector("#post-modal").classList.remove("show");
  currentPostId = null;
};
// 페이지버튼 만들기
const renderPagination = (total) => {
  const pageCount = Math.ceil(total / pageSize);
  const pagination = document.querySelector("#pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = "page-btn";
    if (i === currentPage) btn.disabled = true;
    btn.addEventListener("click", () => {
      currentPage = i;
      loadPage();
    });
    pagination.appendChild(btn);
  }
};
// 페이지 로드 함수
const loadPage = async () => {
  document.querySelector("#board").innerHTML = "";
  console.log(`Loading page ${currentPage}...`);
  const res = await fetch(
    `${post_url}?page=${currentPage}&pageSize=${pageSize}`
  );
  const result = await res.json();
  const posts = result.data || [];
  const total = result.total || 0;
  posts.forEach(createPost);
  renderPagination(total);
};
//게시글 생성
const createPost = (post) => {
  const postLi = document.createElement("li");
  postLi.classList.add("post-container");
  document.querySelector("#board").appendChild(postLi);

  const postTitle = document.createElement("span");
  postTitle.innerText = post.title;
  postTitle.classList.add("bold-text");
  postLi.appendChild(postTitle);

  postLi.addEventListener("click", () => showModal(post));
};
// 초기화 함수
const init = async () => {
  // 페이지네이션 영역 추가
  if (!document.querySelector("#pagination")) {
    const nav = document.createElement("div");
    nav.id = "pagination";
    // post-form의 부모에 pagination을 append
    const formModal = document.querySelector("#form-modal");
    if (formModal && formModal.parentNode) {
      formModal.parentNode.appendChild(nav);
    } else {
      document.body.appendChild(nav);
    }
  }
  loadPage();
};
// 글쓰기 함수
const write = async (data) => {
  const res = await fetch(post_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    currentPage = 1;
    await loadPage();
  }
};
//제출 함수
const submit = () => {
  const title = document.querySelector("#title").value;
  const content = document.querySelector("#content").value;
  const data = {
    title: title,
    content: content,
  };

  if (currentPostId) {
    editPost(data);
  } else {
    write(data);
  }

  // 폼 초기화
  document.querySelector("#title").value = "";
  document.querySelector("#content").value = "";
  currentPostId = null;
};

const deletePost = async () => {
  console.log("Deleting post with ID:", currentPostId);
  if (!currentPostId) return;

  const res = await fetch(`${post_url}/${currentPostId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    hideModal();
    location.reload();
  }
};

const editPost = async (data) => {
  if (!currentPostId) return;

  const res = await fetch(`${post_url}/${currentPostId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    hideModal();
    location.reload();
  }
};

const showFormModal = (title = "", content = "") => {
  document.querySelector("#title").value = title;
  document.querySelector("#content").value = content;
  document.querySelector("#form-modal").classList.add("show");
  document.querySelector("#form-modal-title").innerText = currentPostId
    ? "수정"
    : "글쓰기";
};

const hideFormModal = () => {
  document.querySelector("#form-modal").classList.remove("show");
  document.querySelector("#title").value = "";
  document.querySelector("#content").value = "";
};

document.querySelector("#toggle-write").addEventListener("click", () => {
  currentPostId = null;
  showFormModal();
});

// 모달 버튼 이벤트 연결 (class 기반)
document
  .querySelectorAll(".modal-close")
  .forEach((btn) => btn.addEventListener("click", hideModal));
document
  .querySelectorAll(".modal-delete")
  .forEach((btn) => btn.addEventListener("click", deletePost));
document.querySelectorAll(".modal-edit").forEach((btn) =>
  btn.addEventListener("click", () => {
    const title = document.querySelector("#modal-title").innerText;
    const content = document.querySelector("#modal-content").innerText;
    showFormModal(title, content);
    hideModal();
  })
);
document.querySelectorAll(".form-cancel").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    hideFormModal();
    currentPostId = null;
  })
);

document.querySelector("#post-form").addEventListener("submit", (e) => {
  e.preventDefault();
  submit();
  hideFormModal();
});

// 모달 배경 클릭 시 닫기 (단일게시글)
document.querySelector("#post-modal").addEventListener("mousedown", (e) => {
  if (e.target === e.currentTarget) hideModal();
});
// 모달 배경 클릭 시 닫기 (글쓰기/수정)
document.querySelector("#form-modal").addEventListener("mousedown", (e) => {
  if (e.target === e.currentTarget) hideFormModal();
});

init();
