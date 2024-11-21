let investements = [
    {
        id: 0,
        asset: 'Apple',
        investedAmount: 1000,
        currentValue: 1200
    }
];
//loading the investement from the local page
window.addEventListener('load' , () => {
    const storeInvestement = localStorage.getItem('investement');
    if(storeInvestement){
        investements = JSON.parse(storeInvestement);
        }
        display(); //Display the loaded investements
})
console.log(investements);
let makeAddVisibleToggle = true;
let makeUpdateVisibleToggle = true;
let makeVisualizeToggle = false;

function storeInvestement() {
    localStorage.setItem('investement', JSON.stringify(investements));
}
//making the user to only update/to add value


function makeAddVisible() {
    if (makeAddVisibleToggle) {
        document.getElementById('add-investement-form').style.display = 'block';
        makeUpdateVisibleToggle = false;
    } else {
        alert("Complete the current Update process");
    }
}

function add() {
    //getting the value from the current investement on the asset been made and Ele - element
    const AssetNameEle = document.getElementById('asset');
    const InvestedAmountEle = document.getElementById('invested-amount');
    const currentValueEle = document.getElementById('current-value');
    //creating an object with the data given
    const investement = {
        id: investements.length,
        asset: AssetNameEle.value,
        investedAmount: parseFloat(InvestedAmountEle.value),
        currentValue: parseFloat(currentValueEle.value),
    };
    //get the investement into the array which will be utilized to display information
    investements.push(investement);
    storeInvestement();
    //checking the data stored
    console.log(investements);
    //rendering the information into the table
    display();
    //restoring to accept next possible input 
    AssetNameEle.value = "";
    InvestedAmountEle.value = "";
    currentValueEle.value = "";
    document.getElementById('add-investement-form').style.display = 'none';
    //Make the add investement form visibility to false
    makeUpdateVisibleToggle = true;
}

function display() {
    const tableBody = document.getElementById('table-body');
    const portfolioValue = document.getElementById('portfolio-value');
    //function for calculating portfolio current value
    //using the reduce function which is used to reduce the value into one variable "this is the function i learned"
    const totalProfolioValue = investements.reduce((total, investement) => total + investement.currentValue, 0);
    portfolioValue.innerText = `$${totalProfolioValue}`;
    tableBody.innerHTML = '';
    //To render Every object(each Entry) in the investement array
    investements.forEach(investement => {
        //Trying to create new table row
        const row = document.createElement("tr");
        //calculating percentage using the formula provided for entries
        const percentageChange = (investement.currentValue - investement.investedAmount) / investement.investedAmount * 100;
        //Trying to add table data(column) with the respected data
        row.innerHTML = `
                        <td>${investement.asset}</td>
                        <td>$${investement.investedAmount}</td>
                        <td>$${investement.currentValue}</td>
                        <td>${percentageChange.toFixed(2)}</td>
                        <td><button onclick=updateEntry(${investement.id})>Update</button></td>
                        <td><button onclick=removeEntry(${investement.id})>Remove</button></td>`
        //percentage is limited to 2 decimal place
        //add the create row with table data into table body
        tableBody.appendChild(row);
    });
    //Displaying pie chart / visualize representation 
    drawPieChart(investements)
}

// This is the function used from online
function drawPieChart(investments) {
    const ctx = document.getElementById('pie-chart').getContext('2d');

    // Calculate the total current value of the portfolio
    const totalCurrentValue = investments.reduce((total, investment) => total + investment.currentValue, 0);

    // Prepare data for the chart
    const dataForChart = investments.map(investment => ({
        label: investment.asset,  // Asset name (e.g., Apple, Google)
        value: (investment.currentValue / totalCurrentValue) * 100  // Proportion as percentage
    }));

    // Pie chart data structure
    const chartData = {
        labels: dataForChart.map(item => item.label),  // Labels (investment assets)
        datasets: [{
            data: dataForChart.map(item => item.value),  // Data (percentage of total)
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFDA'],  // Custom colors for each section
        }]
    };

    // Destroy existing chart if it exists, to prevent chart duplication on re-render
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    // Create a new pie chart instance
    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',  // Pie chart type
        data: chartData,  // Data to display
        options: {
            responsive: true,  // Responsive to window resizing
            plugins: {
                legend: {
                    position: 'top',  // Position the legend at the top
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            // Show percentage with two decimal places
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Function to update an investment entry
function updateEntry(id) {
    // Only allow update if there's no active "Add" form visible
    if (makeUpdateVisibleToggle) {
        // Set makeUpdateVisibleToggle to true to block adding investments during an update process
        makeAddVisibleToggle = false;
        // Select the update form and make it visible when the update button is clicked
        const updateForm = document.getElementById('update-form');
        const updateFormBtn = document.getElementById('update-form-btn');
        // Set the click handler dynamically to call updateCurrentValue with the correct ID
        updateFormBtn.setAttribute('onclick', `updateCurrentValue(${id})`);
        updateForm.style.display = 'block';

        // Select the elements in the update form in order to display the current investment details
        const updateFormAssetName = document.getElementById('update-form-asset-name');
        const updateFormInvestedAmount = document.getElementById('update-form-invested-amount');
        const updateFormCurrentValue = document.getElementById('update-form-current-value');
        console.log(id);

        // Get the selected investment entry and populate the form with its current values
        const investement = investements[id];
        updateFormAssetName.value = investement.asset;
        updateFormInvestedAmount.value = investement.investedAmount;
        updateFormCurrentValue.value = investement.currentValue;
    } else {
        alert("Complete the current Adding Process");
    }
}

// The above function will work when the update button in the entry is triggered
// To update the current value, it is done when the "update current Value" button is triggered
function updateCurrentValue(id) {
    // Select the component in the update form, especially the one that we want to update (current value)
    const updateFormCurrentValue = document.getElementById('update-form-current-value');
    const investement = investements[id];
    // Update the current value of the selected investment entry
    investement.currentValue = parseFloat(updateFormCurrentValue.value);
    storeInvestement();
    // Re-render the table to reflect the updated current value
    display();

    // After updating, hide the update form and allow new additions
    document.getElementById('update-form').style.display = 'none';
    //To make the visibilty of update form off
    makeAddVisibleToggle = true;
}

// Function to remove a particular investment entry
function removeEntry(id) {
    const length = investements.length;
    // Filter the investments to remove the selected entry by its ID
    investements = investements.filter(investment => investment.id !== id);
    console.log(investements);

    // Re-map the remaining investments to adjust their IDs after removal
    investements.forEach((investement, index) => investement.id = index);
    storeInvestement();
    // Re-render the table with the updated investments list
    display();
}

// Visualize Performance Toggle and function required
function visualizeBtn() {
    const pieChart = document.getElementById('pie-chart');
    const visualizeBtn = document.getElementById('visualize-btn');
    // if (makeVisualizeToggle) {
    //     pieChart.style.display = 'block';
    //     visualizeBtn.textContent = "Hide pie chart"
    // } else {
    //     pieChart.style.display = 'none';
    //     visualizeBtn.textContent = "Show pie chart"
    // }
    makeVisualizeToggle = !makeVisualizeToggle;
    if(makeVisualizeToggle) {
        visualizeBtn.textContent = 'Hide';
        pieChart.style.display = 'block'
    } else {
        visualizeBtn.textContent = 'show';
        pieChart.style.display = 'none';
    }
}
