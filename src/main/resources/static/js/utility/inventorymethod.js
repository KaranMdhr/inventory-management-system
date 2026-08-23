window.formConfig = {
  title: "Inventory Valuation Method",
  submitAPI: "/organization/update-inventorymethod",
  fetchAPI: "/organization/get-inventorymethod",
  method: "PUT",
  fields: [
    {
      type: "radioGroup",
      label: "Select Inventory Method",
      name: "inventoryMethod",
      options: [
        { value: "LIFO", text: "LIFO" },
        { value: "FIFO", text: "FIFO" },
        { value: "AVERAGE", text: "Average" },
      ],
    },
  ],
  buttons: [
    {
      type: "submit",
      label: "Save",
      position: "bottom",
      class: "btn btn-sm btn-warning",
    },
  ]
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(formConfig.fetchAPI);
    const data = await response.json();

    if (data && data.inventoryMethod) {
      const radioButtons = document.querySelectorAll(`input[name="inventoryMethod"]`);
      radioButtons.forEach(radio => {
        if (radio.value === data.inventoryMethod) {
          radio.checked = true;
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch organization data:", err);
  }
});