import {
  fetchData,
  renderPaginationButtons,
  updateTable,
  getPaginatedData,
  setTableHeaders,
  formateData,
} from "./data.js"
import { displayChart } from "./chart.js"

$(document).ready(async function () {
  // Fetch Data when html is ready
  let countriesData = await fetchData()
  // default selected value
  let selectedValue = "populationSize"
  // Item per page of table also impact chart
  const itemsPerPage = 40
  // Get formatted data based on selected value
  const data = formateData(countriesData, selectedValue)
  // Get paginated data based on selected value
  const paginatedData = getPaginatedData(data, 1, itemsPerPage)

  renderPaginationButtons(itemsPerPage, data, selectedValue)
  setTableHeaders(selectedValue)
  updateTable(selectedValue, paginatedData)
  displayChart(paginatedData, selectedValue)

  $('#myForm input[name="group"]').change(function () {
    selectedValue = $('#myForm input[name="group"]:checked').val()
    const data = formateData(countriesData, selectedValue)
    const paginatedData = getPaginatedData(data, 1, itemsPerPage)
    renderPaginationButtons(itemsPerPage, data, selectedValue)
    setTableHeaders(selectedValue)
    updateTable(selectedValue, paginatedData)
    displayChart(paginatedData, selectedValue)
  })
})
