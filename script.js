let channelsData = []
// ========================================
// 1. Channels and storage
// ========================================
function loadChannels() {
  const savedChannels = localStorage.getItem("telegramChannels")
  if (savedChannels) {
    channelsData = JSON.parse(savedChannels)
  } else {
    // Sample data
    channelsData = [
      {
        id: 268,
        name: "268",
        funnel: "Воронка Неразобранное",
        accountId: "4234234324",
        status: "unauthorized",
      },
      {
        id: 270,
        name: "270",
        funnel: "Воронка Неразобранное",
        accountId: "8923473244",
        status: "authorized",
      },
      {
        id: 278,
        name: "278",
        funnel: "Воронка Неразобранное",
        accountId: "54364564564",
        status: "unauthorized",
      },
      {
        id: 279,
        name: "279",
        funnel: "Воронка Неразобранное",
        accountId: "2142341234",
        status: "unauthorized",
      },
      {
        id: 280,
        name: "280",
        funnel: "Воронка Неразобранное",
        accountId: "12342134234",
        status: "unauthorized",
      },
      {
        id: 281,
        name: "281",
        funnel: "Воронка Неразобранное",
        accountId: "854895444",
        status: "unauthorized",
      },
      {
        id: 282,
        name: "282",
        funnel: "Воронка Неразобранное",
        accountId: "8548954445",
        status: "unauthorized",
      },
      {
        id: 288,
        name: "288",
        funnel: "Воронка Неразобранное",
        accountId: "5345345",
        status: "unauthorized",
      },
      {
        id: 289,
        name: "289",
        funnel: "Воронка Неразобранное",
        accountId: "79613470440",
        status: "unauthorized",
      },
    ]
    saveChannels()
  }
  return channelsData
}

function saveChannels() {
  localStorage.setItem("telegramChannels", JSON.stringify(channelsData))
}

function addChannel(channelData) {
  channelsData.unshift(channelData)
  saveChannels()
  renderTable()
}

function deleteChannel(channelId) {
  channelsData = channelsData.filter((channel) => channel.id !== channelId)
  saveChannels()
  renderTable()
}

function updateChannel(channelId, updatedData) {
  const index = channelsData.findIndex((channel) => channel.id === channelId)
  if (index !== -1) {
    channelsData[index] = { ...channelsData[index], ...updatedData }
    saveChannels()
    renderTable()
  }
}

// ========================================
// 2. Rendering
// ========================================
let search = ''

function renderTable() {
  const $tableBody = $("#tableBody");
  const $cardsContainer = $("#cardsContainer");
  const filteredData = channelsData.filter((channel) => {
      return (
        channel.name.toLowerCase().includes(search) ||
        channel.accountId.includes(search) ||
        channel.funnel.toLowerCase().includes(search)
      )
    })

  if (filteredData.length === 0) {
    $tableBody.html(`
      <tr>
        <td colspan="5" class="empty-state">Каналы не найдены</td>
      </tr>
    `);
    $cardsContainer.html(`
      <div class="card empty-state-card">
        <p>Каналы не найдены</p>
      </div>
    `);
    return;
  }

  // Desktop
  const tableRows = filteredData.map(channel => `
    <tr>
      <td class="channel-name">Канал ${channel.name}</td>
      <td>${channel.funnel}</td>
      <td class="account-data">
        ID:<br>
        <span class="profile">Профиль ${channel.accountId}</span>
      </td>
      <td class="status-${channel.status}">
        ${channel.status === "unauthorized" ? "Авторизуйтесь" : "Подключен"}
      </td>
      <td><button class="menu-button" data-action="menu" data-channel-id="${channel.id}">⋮</button></td>
    </tr>
  `).join("");
  $tableBody.html(tableRows);

  // Mobile
  const cards = filteredData.map(channel => `
    <div class="card">
      <div class="card-header">
        <div class="channel-name">Канал ${channel.name}</div>
        <button class="menu-button" data-action="menu" data-channel-id="${channel.id}">⋮</button>
      </div>
      <div class="card-body">
        <div><strong>Воронка:</strong> ${channel.funnel}</div>
        <div><strong>Данные аккаунта:</strong><br>ID: ${channel.accountId}<br>Профиль ${channel.accountId}</div>
        <div><strong>Статус:</strong> 
          <span class="status-${channel.status}">
            ${channel.status === "unauthorized" ? "Авторизуйтесь" : "Подключен"}
          </span>
        </div>
      </div>
    </div>
  `).join("");
  $cardsContainer.html(cards);

  attachActionListeners();
}

// ========================================
// 3. Context menu event
// ========================================
let currentChannelId = null;

function showContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const menu = $("#contextMenu");
  const button = $(event.currentTarget);

  currentChannelId = button.data("channel-id");

  const buttonOffset = button.offset();
  const buttonHeight = button.outerHeight();

  menu.css({
    display: "block",
    top: buttonOffset.top + buttonHeight + 4,
    left: buttonOffset.left - menu.outerWidth() + button.width()
  });

  const menuRight = menu.offset().left + menu.outerWidth();
  if (menuRight > $(window).width()) {
    menu.css("left", buttonOffset.left - menu.outerWidth() + button.width());
  }
}

function handleContextMenuEvent(event) {
  const button = $(event.currentTarget);
  const action = button.data('action');
  switch (action) {
    case 'settings':
      hideContextMenu();
      break;
    case 'delete': 
      deleteChannel(currentChannelId);
      hideContextMenu();
  }
}

function hideContextMenu() {
  $("#contextMenu").hide();
  currentChannelId = null;
}

function attachActionListeners() {
  $("#tableBody, #cardsContainer").off("click", "[data-action]")
  $("#tableBody, #cardsContainer").on("click", "[data-action]", showContextMenu)
}

// ========================================
// 4. Qr-code modal and event
// ========================================
function openAddChannelModal() {
  $("#modalOverlay").addClass("active");
  $("body").css("overflow", "hidden");

  const fakeLink = "tg://login?token=AQRvbzlpDhqD1Lx4NRl77EX1DHs6B64eKKicteLTBRAypA"; 

  new QRCode(document.getElementById("qrcode"), {
    text: fakeLink,
    width: 240,
    height: 240,
    colorDark: "#000000",
    colorLight: "#ffffff"
  });

  setTimeout(() => {
    const newChannel = {
      id: Date.now(),
      name: `${channelsData.length + 1}`,
      funnel: "Воронка Неразобранное",
      accountId: Math.floor(Math.random() * 10000000000).toString(),
      status: "authorized",
    };
    addChannel(newChannel);
    closeModal();
  }, 5000);
}

function closeModal() {
  $("#qrcode").empty();
  $("#modalOverlay").removeClass("active")
  $("body").css("overflow", "")
}


// ========================================
// 5. Initialization
// ========================================
$(document).ready(() => {
  loadChannels()
  $("#searchInput").on("input", function (e) {
    search = $(e.currentTarget).val().toLowerCase()
    renderTable()
  })

  $('#contextMenu').on("click", "[data-action]", handleContextMenuEvent)
  
  $("#addChannelBtn").on("click", openAddChannelModal);
  $("#modalContent").on("click", (e) => {
    e.stopPropagation()
  })
  $("#modalCloseBtn").on("click", closeModal)
  $("#modalOverlay").on("click", (e) => {
    if ($(e.target).is("#modalOverlay")) {
      closeModal()
    }
  })


  $(document).on("click", (e) => {
    if (!$(e.target).closest("#contextMenu, .menu-button").length) {
      hideContextMenu();
    }
  });

  // Close modal on Escape key
  $(document).on("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
      hideContextMenu();
    }
  })

  renderTable()
})