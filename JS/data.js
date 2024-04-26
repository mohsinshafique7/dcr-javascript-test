import { displayChart } from "./chart.js"
/**
 * Fetches data from the specified URL and returns it as a JSON object.
 * @async
 * @returns {Promise<Object>} A Promise that resolves with the fetched JSON data.
 * @throws {Error} If the network response is not ok.
 */
export async function fetchData() {
  try {
    const response = await fetch("./data/countries.json")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    window.location.href = "error.html"
  }
}

/**
 * Renders pagination buttons based on the given items per page, data, and selected value.
 * @param {number} itemsPerPage - Number of items to display per page.
 * @param {Array} data - The array of data to paginate.
 * @param {string} selectedValue - The selected value.
 */
export function renderPaginationButtons(itemsPerPage, data, selectedValue) {
  const $pagination = $("#pagination")
  $pagination.empty() // Clear existing buttons
  const pageCount = Math.ceil(data.length / itemsPerPage)
  for (let i = 1; i <= pageCount; i++) {
    const $button = $("<button>").text(i)
    $button.on("click", function () {
      $pagination.find("button").removeClass("selected")
      $(this).addClass("selected")
      const paginatedData = getPaginatedData(data, i, itemsPerPage)
      updateTable(selectedValue, paginatedData)
      displayChart(paginatedData, selectedValue)
    })
    $pagination.append($button)
  }
  $pagination.find("button:first").addClass("selected")
}
/**
 * Update the table with the provided data based on the selected value.
 * @param {string} selectedValue - The selected value to determine how to update the table.
 * @param {Array<Object>} updatedData - The updated data to populate the table.
 * @returns {void}
 */
export function updateTable(selectedValue, updatedData) {
  const $tableBody = $("#table-body")
  $tableBody.empty()
  updatedData.forEach((record) => {
    const {
      name,
      population,
      alpha3Code,
      capital,
      borders,
      timezones,
      region,
      country,
      languages,
    } = record
    // Create table row
    const $row = $("<tr>")

    // Create and append table cells
    const $nameCell = $("<td>")
    const $populationCell = $("<td>")
    const $alpha3Code = $("<td>")
    const $region = $("<td>")
    const $capital = $("<td>")
    const $borders = $("<td>")
    const $timezones = $("<td>")
    function setCommonTextValues() {
      $nameCell.text(name)
      $alpha3Code.text(alpha3Code)
      $capital.text(capital)
      $region.text(region)
      $borders.text(borders)
      $timezones.text(timezones)
      $populationCell.text(population)
    }
    if (selectedValue === "populationSize") {
      $nameCell.text(name)
      $alpha3Code.text(alpha3Code)
      $capital.text(capital)
      $region.text(region)
      $borders.text(borders)
      $timezones.text(timezones)
      $populationCell.text(population)

      $row.append($nameCell)
      $row.append($alpha3Code)
      $row.append($region)
      $row.append($capital)
      $row.append($borders)
      $row.append($timezones)
      $row.append($populationCell)
    } else if (selectedValue === "noOfBoarders") {
      $nameCell.text(name)
      $alpha3Code.text(alpha3Code)
      $capital.text(capital)
      $region.text(region)
      $borders.text(borders)
      $timezones.text(timezones)
      $populationCell.text(population)
      $row.append($nameCell)
      $row.append($alpha3Code)
      $row.append($capital)
      $row.append($region)
      $row.append($borders)
      $row.append($timezones)
      $row.append($populationCell)
    } else if (selectedValue === "noOfTimezones") {
      console.log(record)
      $nameCell.text(name)
      $alpha3Code.text(alpha3Code)
      $capital.text(capital)
      $region.text(region)
      $borders.text(borders)
      $timezones.text(timezones)
      $populationCell.text(population)
      $row.append($nameCell)
      $row.append($alpha3Code)
      $row.append($region)
      $row.append($capital)
      $row.append($borders)
      $row.append($timezones)
      $row.append($populationCell)
    } else if (selectedValue === "noOfLanguages") {
      $nameCell.text(name)
      $alpha3Code.text(alpha3Code)
      $capital.text(capital)
      $region.text(region)
      $borders.text(borders)
      $timezones.text(timezones)
      $populationCell.text(languages)

      $row.append($nameCell)
      $row.append($alpha3Code)
      $row.append($region)
      $row.append($capital)
      $row.append($borders)
      $row.append($populationCell)
      $row.append($timezones)
    } else if (selectedValue === "countriesInRegion") {
      $nameCell.text(region)
      $alpha3Code.text(country)
      $row.append($nameCell)
      $row.append($alpha3Code)
    } else if (selectedValue === "uniqueTimeZones") {
      $nameCell.text(region)
      $alpha3Code.text(timezones.length)
      $row.append($nameCell)
      $row.append($alpha3Code)
    }

    // Append row to table body
    $tableBody.append($row)
  })
}
/**
 * Format the provided data based on the selected value.
 * @param {Array<Object>} data - The data to format.
 * @param {string} selectedValue - The selected value to determine the formatting.
 * @returns {Array<Object>} The formatted data.
 */
export function formateData(data, selectedValue) {
  return data.reduce((result, item) => {
    const {
      name,
      region,
      timezones,
      population,
      borders,
      languages,
      alpha3Code,
      capital,
    } = item
    if (selectedValue === "populationSize") {
      result.push({
        name,
        region,
        population,
        alpha3Code,
        capital,
        timezones: timezones.join(", "),
        borders: borders.join(","),
      })
    } else if (selectedValue === "noOfBoarders") {
      result.push({
        name,
        region,
        population,
        alpha3Code,
        capital,
        timezones,
        borders: borders.length,
      })
    } else if (selectedValue === "noOfTimezones") {
      result.push({
        name,
        region,
        population,
        alpha3Code,
        capital,
        timezones: timezones.length,
        borders,
      })
    } else if (selectedValue === "noOfLanguages") {
      result.push({
        name,
        region,
        alpha3Code,
        capital,
        population,
        timezones,
        borders,
        languages: languages.length,
      })
    } else if (selectedValue === "countriesInRegion") {
      const foundRegion = result.find((r) => r.region === region)
      if (foundRegion) {
        foundRegion.country++
      } else {
        result.push({ region: region, country: 1 })
      }
    } else if (selectedValue === "uniqueTimeZones") {
      const foundRegion = result.find((r) => r.region === region)
      if (foundRegion) {
        timezones.forEach((tItem) => {
          if (!foundRegion.timezones.includes(tItem)) {
            foundRegion.timezones.push(tItem)
          }
        })
      } else {
        result.push({ region, timezones })
      }
    }
    return result
  }, [])
}
/**
 * Get paginated data from the provided array.
 * @param {Array<any>} data - The array of data to paginate.
 * @param {number} pageNumber - The page number (default: 1).
 * @param {number} itemsPerPage - The number of items per page (default: 10).
 * @returns {Array<any>} The paginated data.
 */
export function getPaginatedData(data, pageNumber = 1, itemsPerPage = 10) {
  const startIndex = (pageNumber - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return data.slice(startIndex, endIndex)
}
/**
 * Set table headers based on the selected value.
 * @param {string} selectedValue - The selected value to determine which headers to set.
 * @returns {void}
 */
export function setTableHeaders(selectedValue) {
  const $tableHeader = $("#table-header")
  const $row = $("<tr>")
  const $nameHeader = $("<th>")
  const $alphaCode3 = $("<th>")
  const $region = $("<th>")
  const $capital = $("<th>")
  const $borders = $("<th>")
  const $timezones = $("<th>")
  const $population = $("<th>")
  const $languages = $("<th>")
  const $countries = $("<th>")

  $tableHeader.empty()
  if (selectedValue === "populationSize") {
    $row.append($nameHeader.text("Name"))
    $row.append($alphaCode3.text("Alpha Code3"))
    $row.append($region.text("Region"))
    $row.append($capital.text("Capital"))
    $row.append($borders.text("Border(s)"))
    $row.append($timezones.text("Timezone(s)"))
    $row.append($population.text("Population"))
  } else if (selectedValue === "noOfBoarders") {
    $row.append($nameHeader.text("Name"))
    $row.append($alphaCode3.text("Alpha Code3"))
    $row.append($region.text("Region"))
    $row.append($capital.text("Capital"))
    $row.append($borders.text("No Of Border(s)"))
    $row.append($timezones.text("Timezone(s)"))
    $row.append($population.text("Population"))
  } else if (selectedValue === "noOfTimezones") {
    $row.append($nameHeader.text("Name"))
    $row.append($alphaCode3.text("Alpha Code3"))
    $row.append($region.text("Region"))
    $row.append($capital.text("Capital"))
    $row.append($borders.text("Border(s)"))
    $row.append($timezones.text("No Of Timezone(s)"))
    $row.append($population.text("Population"))
  } else if (selectedValue === "noOfLanguages") {
    $row.append($nameHeader.text("Name"))
    $row.append($alphaCode3.text("Alpha Code3"))
    $row.append($region.text("Region"))
    $row.append($capital.text("Capital"))
    $row.append($borders.text("Border(s)"))
    $row.append($languages.text("No Of Languages"))
    $row.append($timezones.text("Timezone(s)"))
  } else if (selectedValue === "countriesInRegion") {
    $row.append($region.text("Region"))
    $row.append($countries.text("Countries In Region"))
  } else if (selectedValue === "uniqueTimeZones") {
    $row.append($region.text("Region"))
    $row.append($timezones.text("Timezones"))
  }
  $tableHeader.append($row)
}
