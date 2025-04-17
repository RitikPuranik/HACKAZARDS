document.addEventListener("DOMContentLoaded", () => {
    const ideaInput = document.getElementById("ideaInput");
    const ideaList = document.getElementById("ideaList");
    const addBtn = document.querySelector(".add-btn");
    let ideaCount = 0;

    const modal = document.createElement("div");
    modal.className = "modal hidden";
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Name Your Idea 💡</h2>
            <input type="text" id="ideaTitle" placeholder="Idea Title" />
            <button id="saveIdea">Save</button>
        </div>
    `;
    document.body.appendChild(modal);

    let ideaTextTemp = "";

    addBtn.addEventListener("click", () => {
        const ideaText = ideaInput.value.trim();

        if (ideaText !== "") {
            ideaTextTemp = ideaText;
            ideaInput.value = "";
            showModal();
        } else {
            ideaInput.style.border = "2px solid #ff4d4d";
            setTimeout(() => ideaInput.style.border = "", 800);
        }
    });

    document.getElementById("saveIdea").addEventListener("click", () => {
        const ideaTitle = document.getElementById("ideaTitle").value.trim();

        if (ideaTitle !== "") {
            ideaCount++;
            createIdeaCard(ideaCount, ideaTitle, ideaTextTemp);
            hideModal();
            document.getElementById("ideaTitle").value = "";
        }
    });

    function showModal() {
        modal.classList.remove("hidden");
    }

    function hideModal() {
        modal.classList.add("hidden");
    }

    modal.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            document.getElementById("saveIdea").click();
        }
    });

    function createIdeaCard(number, title, description) {
        const card = document.createElement("div");
        card.className = "idea-card";
        card.innerHTML = `
            <div class="idea-label">Idea ${number}</div>
            <h3 class="idea-title">${title}</h3>
            <p class="idea-description">${description}</p>
        `;

        card.addEventListener("click", () => {
            openEditorModal(number, title, description, card);
        });

        ideaList.appendChild(card);

        card.animate([
            { transform: 'scale(0.95)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
    }

    function openEditorModal(number, currentTitle, currentDesc, cardElement) {
        const editorModal = document.createElement("div");
        editorModal.className = "modal";
        editorModal.innerHTML = `
            <div class="editor-box">
                <div class="idea-label big">Working on Idea ${number} ⚙️</div>
                <h4 class="idea-title">Edit Idea Title</h4>
                <input type="text" id="editTitle" value="${currentTitle}" />
                <H4 class="idea-title">Edit Idea Description</H4>
                <textarea id="editDescription">${currentDesc}</textarea>
                <div class="modal-actions">
                    <button id="saveEdit">Save</button>
                    <button id="cancelEdit">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(editorModal);

        editorModal.querySelector("#cancelEdit").addEventListener("click", () => {
            document.body.removeChild(editorModal);
        });

        editorModal.querySelector("#saveEdit").addEventListener("click", () => {
            const newTitle = editorModal.querySelector("#editTitle").value.trim();
            const newDesc = editorModal.querySelector("#editDescription").value.trim();

            if (newTitle && newDesc) {
                cardElement.querySelector(".idea-title").textContent = newTitle;
                cardElement.querySelector(".idea-description").textContent = newDesc;
            }

            document.body.removeChild(editorModal);
        });

        editorModal.addEventListener("keydown", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                editorModal.querySelector("#saveEdit").click();
            }
        });
    }
});
