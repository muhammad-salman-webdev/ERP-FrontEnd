const leftSidePanelBtn = document.querySelector("input#hamburger");
const leftSidePanel = document.querySelector(
  ".sidebars-bottom-navigation-main-container .left-toggle-side-panel-container"
);
const bottomPanel = document.querySelector(
  ".sidebars-bottom-navigation-main-container .main-bottom-toggle-panel-container"
);

const panelContainer = document.querySelector(`.bottom-panel-tabs-container`);

function manageBottomPanelByRightSidebar() {
  const isAnyActiveItemInSidebar = document.querySelector(
    ".right-sidebar-container .right-sidebar-item.active"
  );

  bottomPanel.style.right = isAnyActiveItemInSidebar
    ? "calc(var(--right-sidebar-width) + 50px)"
    : "50px";
  resizeBorders();
}

leftSidePanelBtn.addEventListener("change", () => {
  leftSidePanel.classList.toggle("opened");
  bottomPanel.style.left = leftSidePanel.classList.contains("opened")
    ? "var(--left-sidebar-width)"
    : "0";
  resizeBorders();
});

let charts = [];
const rightPanelItems = document.querySelectorAll(
  ".right-sidebar-container .right-sidebar-item"
);

rightPanelItems.forEach((item, index) => {
  const btn = item.querySelector(".sidebar-btn");
  btn.addEventListener("click", () => {
    rightPanelItems.forEach((s_item, s_index) => {
      if (index === s_index) {
        s_item.classList.toggle("active");
      } else {
        s_item.classList.remove("active");
      }
    });
    manageBottomPanelByRightSidebar();

    resizeBorders();
  });

  // X close button
  const closeBtn = item.querySelector(
    ".sidebar-popup > .popup-content-main > .header > i"
  );
  closeBtn.addEventListener("click", () => {
    document
      .querySelector(".right-sidebar-container .right-sidebar-item.active")
      .classList.remove("active");
    manageBottomPanelByRightSidebar();
  });
});

// Bottom Panel Functionalities

const bottomPanelBtns = document.querySelectorAll(
  ".bottom-panel-tabs-btns .bottom-panel-tab-btn"
);
const bottomPanels = document.querySelectorAll(
  ".bottom-panel-tabs-container > .bottom-panel-tab"
);

bottomPanelBtns.forEach((panelBtn, index) => {
  // reseting tab buttons
  panelBtn.addEventListener("click", () => {
    let toggleCheck = false;

    bottomPanelBtns.forEach((s_panelBtn, s_index) => {
      if (index === s_index)
        if (panelBtn.classList.contains("active")) toggleCheck = true;

      s_panelBtn.classList.remove("prev");
      s_panelBtn.classList.remove("active");
      s_panelBtn.classList.remove("next");
    });

    // reseting all tabs panel
    bottomPanels.forEach((panel) => {
      panel.classList.remove("active");
      // panel.style.minHeight = "0px";
      panel.style.height = "0px";
    });

    if (!toggleCheck) {
      // active one tab button
      panelBtn.classList.add("active");

      let n = panelBtn.nextElementSibling;
      if (n) n.classList.add("next");

      let p = panelBtn.previousElementSibling;
      if (p) p.classList.add("prev");

      // getting the unique ID
      const uniqueID = panelBtn.getAttribute("data-bottom-panel-btn");
      const relevantPanel = document.querySelector(
        `.bottom-panel-tabs-container .bottom-panel-tab[data-bottom-panel-tab='${uniqueID}']`
      );
      relevantPanel.style.height = "var(--bottom-tab-default-height)";
      relevantPanel.classList.add("active");
    } else {
      panelContainer.style.height = "auto";
    }
    resizeBorders();
  });
});

// Height increasing by drag and drop
const dragElem = document.querySelector(
  ".bottom-panel-content-container .drag-and-drop-elem"
);

let isLowerTabResizing = false;
let startPosY, startHeight;

document.addEventListener("mousemove", (e) => {
  if (!isLowerTabResizing) return;
  const deltaY = e.clientY - startPosY;
  let newHeight = startHeight - deltaY;

  if (newHeight >= 40) {
    panelContainer.style.height = newHeight + "px";
    if (!panelContainer.classList.contains("height-increased"))
      panelContainer.classList.add("height-increased");
  } else {
    bottomPanelBtns.forEach((s_panelBtn, s_index) => {
      s_panelBtn.classList.remove("prev");
      s_panelBtn.classList.remove("active");
      s_panelBtn.classList.remove("next");
    });

    bottomPanels.forEach((panel) => {
      panel.classList.remove("active");
      panel.style.height = "0px";
    });

    isLowerTabResizing = false;

    panelContainer.style.height = "auto";
    panelContainer.classList.remove("height-increased");
  }

  resizeBorders();
});

dragElem.addEventListener("mousedown", (e) => {
  isLowerTabResizing = true;
  startPosY = e.clientY;
  startHeight = panelContainer.clientHeight;
  e.preventDefault();
});

dragElem.addEventListener("mouseup", () => {
  isLowerTabResizing = false;
});

document.addEventListener("mouseup", () => {
  isLowerTabResizing = false;
});

// Showing/hidding the Gantt container
const gearPopupToggleBtn = document.getElementById("gear-popup-toggle-btn");
const gearPopupElem = document.querySelector(".gear-popup-main-container");
const gearPopupCloseBtn = gearPopupElem.querySelector(".gear-popup-close-btn");

function toggleGearPopup() {
  gearPopupElem.classList.toggle("shown");
  gearPopupToggleBtn.classList.toggle("active");
}
gearPopupToggleBtn.addEventListener("click", toggleGearPopup);
gearPopupCloseBtn.addEventListener("click", toggleGearPopup);

// Gear menu list and containers toggling
const gearPopupMenuBtns = document.querySelectorAll(
  ".gear-menu-buttons-container > li[data-gear-menu-container]"
);
gearPopupMenuBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    for (let _i = 0; _i < gearPopupMenuBtns.length; _i++) {
      const _btn = gearPopupMenuBtns[_i];
      const _id = _btn.getAttribute("data-gear-menu-container");
      const _optMenu = document.querySelector(
        `.gear-menu-opt-container[data-gear-menu-container-name='${_id}']`
      );
      if (i == _i) {
        if (!_btn.classList.contains("active")) {
          _btn.classList.add("active");
          _optMenu.classList.add("active");
        }
      } else {
        _btn.classList.remove("active");
        _optMenu.classList.remove("active");
      }
    }
  });
});

// Showing text in the input='text' and making input='number' on focus
const textDaysInputElems = document.querySelectorAll(
  "input.text-into-number-toggle-input"
);

textDaysInputElems.forEach((input) => {
  let number = input.value;
  function updateText() {
    input.value = number + " " + input.getAttribute("data-text");
  }
  updateText();

  input.addEventListener("focus", () => {
    input.type = "number";
    input.value = number;
  });
  input.addEventListener("input", () => {
    number = input.value;
  });
  input.addEventListener("focusout", () => {
    input.type = "text";
    updateText();
  });
});

// Selecting None makes the date input disabled
const selectMakeNoneElems = document.querySelectorAll(
  ".select-none-date-disable  select"
);
selectMakeNoneElems.forEach((select) => {
  function updateSelect() {
    select.classList.remove("disabled");
    if (select.value === "none") select.classList.add("disabled");
  }
  updateSelect();
  select.addEventListener("change", updateSelect);
});
// Double sections width adjustment

const doubleAdjustableElems = document.querySelectorAll(
  ".double-adjustable-sections-container"
);

doubleAdjustableElems.forEach((doubleElem) => {
  let resizer = doubleElem.querySelector(".double-adjustable-resizer");
  let isDoubleRisizing = false;

  resizer.addEventListener("mousedown", () => {
    isDoubleRisizing = true;
    resizer.classList.add("resizing");
  });
  doubleElem.addEventListener("mousemove", (e) => {
    if (!isDoubleRisizing) return;
    let eWidth = leftSidePanelBtn.checked
      ? Number(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--left-sidebar-width")
            .trim()
            .slice(0, -2)
        )
      : 0;
    let newWidth =
      e.clientX - doubleElem.getBoundingClientRect().left - eWidth - 2;
    doubleElem.style.gridTemplateColumns = `${newWidth}px max-content auto`;
    resizeBorders();
  });
  doubleElem.addEventListener("mouseup", () => {
    isDoubleRisizing = false;
    resizer.classList.remove("resizing");
  });
});

// Resizing functionalities for table cells

function resizeBorders() {
  const allTableElems = document.querySelectorAll(
    ".adjustable-table-container"
  );
  allTableElems.forEach((t) => {
    t.style.setProperty("--height", `0`);
    t.style.setProperty("--height", `${t.scrollHeight}px`);
  });

  charts.forEach((chart) => {
    chart.resize();
  });
  let o = setInterval(() => {
    charts.forEach((chart) => {
      chart.resize();
    });
  }, 10);
  setTimeout(() => {
    clearInterval(o);
  }, 500);
}
document
  .querySelectorAll(".chart-table-toggle-btn input[type='radio']")
  .forEach((a) => {
    a.addEventListener("change", resizeBorders);
  });
document.addEventListener("resize", resizeBorders);
resizeBorders();
// ===============================================
const resizableDragableTables = document.querySelectorAll(
  ".adjustable-table-container"
);
resizableDragableTables.forEach((container, c_i) => {
  // Adding Resizer
  const table = container.querySelector(".resizable-dragable-table");
  const allTh = table.querySelectorAll("th");

  const allTr = table.querySelectorAll("tr");
  allTr.forEach((tr) => {
    let cols = tr.querySelectorAll("th");
    if (cols.length === 0) cols = tr.querySelectorAll("td");
    cols.forEach((col, col_i) => {
      col.setAttribute("identifier", `t_${c_i}_c_${col_i}`);
    });
  });

  let isDragging = false;
  let activeTh = null;
  let rTh = null;
  let lOr = null;

  let activeResizerID = null;

  for (let i = 0; i < allTh.length; i++) {
    let th = allTh[i];
    const thID = th.getAttribute("identifier");
    // resizing
    if (!th.hasAttribute("no-resizing")) {
      const resizer = document.createElement("div");
      resizer.classList.add("resizer");
      th.appendChild(resizer);

      // Resizing
      let resizing = false;
      resizer.addEventListener("mousedown", () => {
        resizing = true;
        resizer.classList.add("resizing");
        activeResizerID = th.getAttribute("identifier");
      });
      document.addEventListener("mousemove", (e) => {
        if (!resizing) return;
        let thX = th.getBoundingClientRect().left;
        let X = e.clientX;

        let w = X - thX;
        if (w >= 50) {
          w = `${X - thX + 2}px`;
          th.style.width = w;
          const d = th.querySelector("div:not(.resizer)");
          th.style.minWidth = w;
          th.style.maxWidth = w;
          th.style.width = w;

          d.style.minWidth = w;
          d.style.maxWidth = w;
          d.style.width = w;

          const corresTds = table.querySelectorAll(
            `tr > td[identifier='${activeResizerID}'] > div`
          );
          corresTds.forEach((div) => {
            div.parentElement.style.minWidth = w;
            div.parentElement.style.maxWidth = w;
            div.parentElement.style.width = w;

            div.style.minWidth = w;
            div.style.maxWidth = w;
            div.style.width = w;
          });
        }
        resizeBorders();
      });
      document.addEventListener("mouseup", () => {
        resizing = false;
        resizer.classList.remove("resizing");
      });
    }

    // re-arragment
    if (!th.hasAttribute("no-drag")) {
      const _th = th.querySelector("div");
      _th.draggable = true;

      // adding drag recieve div
      const div = document.createElement("div");
      div.classList.add("drag-recieve");

      const dl = document.createElement("div");
      dl.classList.add("drop-left");

      const dr = document.createElement("div");
      dr.classList.add("drop-right");

      div.append(dl, dr);

      th.appendChild(div);

      // draging start
      dl.addEventListener("dragover", () => {
        if (isDragging) {
          activeTh.classList.remove("no-drapping");
          rTh = thID;
          lOr = "l";
        }
      });
      dr.addEventListener("dragover", () => {
        if (isDragging) {
          activeTh.classList.remove("no-drapping");
          rTh = thID;
          lOr = "r";
        }
      });

      _th.addEventListener("dragstart", () => {
        isDragging = true;
        activeTh = th;
        table.classList.add("dragging-columns");
        th.classList.add("no-drapping");
      });

      _th.addEventListener("dragend", () => {
        isDragging = false;
        table.classList.remove("dragging-columns");
        th.classList.remove("no-drapping");

        if (thID != rTh) {
          let thTr = table.querySelectorAll("tr:has(th)");
          thTr.forEach((tr) => {
            const columns = Array.from(tr.getElementsByTagName("th"));
            for (let _p = 0; _p < columns.length; _p++) {
              let col = columns[_p];
              if (col.getAttribute("identifier") === rTh) {
                if (lOr === "l") {
                  tr.insertBefore(activeTh, col);
                } else {
                  tr.insertBefore(activeTh, col.nextElementSibling);
                }
              }
            }
          });

          let tdTr = table.querySelectorAll("tr:has(td)");
          tdTr.forEach((tr) => {
            const columns = Array.from(tr.getElementsByTagName("td"));
            for (let _p = 0; _p < columns.length; _p++) {
              let col = columns[_p];
              if (col.getAttribute("identifier") === rTh) {
                activeTh = tr.querySelector(
                  `td[identifier='${activeTh.getAttribute("identifier")}']`
                );
                if (lOr === "l") {
                  tr.insertBefore(activeTh, col);
                } else {
                  tr.insertBefore(activeTh, col.nextElementSibling);
                }
              }
            }
          });
        }
      });
    }
  }
});

// ====================
const dropdownTrs = document.querySelectorAll(
  ".resizable-dragable-table tr.tr-dropdown-toggle"
);

dropdownTrs.forEach((tr) => {
  const btn = tr.querySelector("td.name > div > i");
  btn.addEventListener("click", () => {
    tr.classList.toggle("active");
    const id = tr.getAttribute("dropdown-id");
    const subTr = document.querySelectorAll(
      `tr.tr-dropdown-toggle-item[dropdown-id='${id}']`
    );
    subTr.forEach((str) => str.classList.toggle("active"));
    resizeBorders();
  });
});
// ========================================
const allTableCharts = document.querySelectorAll(
  ".chart-table-adjustable-section"
);
let red_line, grey_line;

function createTableRow(data, type) {
  var row = document.createElement("div");

  row.classList.add(type + "-row");
  data.forEach((item, item_i) => {
    var col = document.createElement("div");

    if (type == "td") {
      if (item.value) col.classList.add("b-bg");
      if (!item.value && item.baseline) col.classList.add("o-bg");
      if (item_i === red_line) col.classList.add("red-line");
      if (item_i === grey_line) col.classList.add("grey-line");
    }

    var p = document.createElement("p");
    p.textContent = item.value;

    var span = document.createElement("span");
    span.textContent = item.baseline;

    col.append(p, span);
    row.appendChild(col);
  });

  return row;
}

allTableCharts.forEach((con, con_i) => {
  // Table functionalities
  const table = con.querySelector(
    ".chart-table-graphs-container .table_graph_main"
  );
  let tableData, chartData;
  if (con_i === 0) {
    tableData = team_tableData;
    red_line = team_table_red_line;
    grey_line = team_table_grey_line;
    //
    chartData = team_chartData;
  } else {
    tableData = trade_tableData;
    red_line = trade_table_red_line;
    grey_line = trade_table_grey_line;
    //
    chartData = trade_chartData;
  }

  const tableHeader = createTableRow(tableData.headers, "th");
  table.appendChild(tableHeader);

  for (let index = 0; index < tableData.body.length; index++) {
    const tableRow = createTableRow(tableData.body[index].colmuns, "td");
    table.appendChild(tableRow);
  }

  // Chart Functionalities
  const chartElem = con.querySelector(
    ".chart-table-graphs-container .chart_graph_main"
  );

  let chart = echarts.init(chartElem, "light", {
    renderer: "svg",
    useDirtyRect: false,
  });

  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        var content = "";
        params.forEach(function (param) {
          content += param.seriesName + ": " + param.value + "<br>";
        });
        return content;
      },
    },
    legend: {
      show: false,
    },
    toolbox: {
      show: false,
    },
    xAxis: [
      {
        show: true,
        type: "category",
        axisLine: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
        axisTick: { show: false },
        axisLabel: {
          show: false,
          textStyle: {
            color: "dimgray",
          },
        },
        interval: 1,
        data: chartData.labels,

        boundaryGap: true,
      },
      {
        show: false,
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        type: "value",
        axisPointer: {
          show: false, // Disable hover effect on the x-axis
        },
        data: chartData.labels,
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          textStyle: {
            color: "dimgray",
          },
        },
        min: 0,
        axisTick: { show: true },
      },
    ],
    grid: {
      left: "1%",
      top: "10%",
      right: "0%",
      width: "99%",
      height: "88%",
      bottom: "2%",
      containLabel: true,
    },
    series: [
      {
        xAxisIndex: 0,
        name: chartData.chartBarTitle,
        type: "bar",
        barMaxWidth: 25,
        label: {
          show: true,
          fontSize: 10,
          position: "top",
          color: "#1F1F1F",
        },
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          focus: "none",
        },
        data: chartData.barData,
      },
      {
        name: "Baseline",
        xAxisIndex: 1,
        data: chartData.baseLine,
        type: "line",
        smooth: true,
        lineStyle: {
          color: "transparent",
          width: 2,
        },
        z: 100,
        symbolSize: 0,
        markLine: {
          xAxisIndex: 1,
          symbol: "none",
          silent: true,
          z: 200,
          data: [
            {
              name: "data 4",
              xAxis: chartData.redLine - 0.5,
              label: {
                normal: {
                  show: false,
                },
              },
              lineStyle: {
                color: "red",
                type: "solid",
                width: 2,
              },
            },
            {
              name: "Grey dashed line",
              xAxis: chartData.greyline + 0.5,
              label: {
                normal: {
                  show: false,
                },
              },
              lineStyle: {
                color: "blue",
                type: "dashed",
                width: 2,
              },
            },
          ],
        },
      },
    ],
  };

  chart.setOption(option);

  charts[con_i] = chart;

  // Toggle Baselines
  const chkbox = con.querySelector(
    "label.chart-table-baseline-toggle-btn > input[type='checkbox']"
  );
  chkbox.addEventListener("change", () => {
    // showing baseline in table
    table.classList.toggle("show-baseline");
    // showing baseline in chart
    if (option.series.length > 2) {
      option.series = [...option.series.slice(0, -2)];
      chart.clear();
      chart.setOption(option);
    } else {
      option.series.push({
        name: chartData.baselineBarTitle,
        xAxisIndex: 0,
        type: "bar",
        barGap: "-30%",
        label: {
          show: true,
          fontSize: 8,
          position: "top",
          color: "#E4730C",
        },
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
        },
        emphasis: {
          focus: "none",
        },
        barMaxWidth: 10,
        data: chartData.baselineBarsData,
      });

      option.series.push({
        name: "baseline",
        xAxisIndex: 1,
        data: chartData.baseLine,
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#e8862d",
          width: 2,
        },
        z: 100,
        symbolSize: 0,
      });

      chart.clear();
      chart.setOption(option);
    }
  });
});
