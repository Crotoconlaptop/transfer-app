// Datos simulados de items, barras, y transferencias
const items = ['Low Fat Milk', 
                'Full Fat Milk', 
                'Lacto Free Milk', 
                'Free Fat Milk', 
                'Coconut Milk', 
                'Almond Milk',
                'Coffee beans',
                'Decaf Coffee beans'];
const barras = ['St Regis Bar', 'Jackie', 'Stella'];
const transferencias = [];

// Función para cargar items en el select
function loadItems() {
  const selectItem = document.getElementById('select-item');
  selectItem.innerHTML = '';

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    selectItem.appendChild(option);
  });
}

// Función para cargar barras en los selects
function loadBarras() {
  const selectFrom = document.getElementById('select-from');
  const selectTo = document.getElementById('select-to');

  selectFrom.innerHTML = '';
  selectTo.innerHTML = '';

  barras.forEach(barra => {
    const optionFrom = document.createElement('option');
    const optionTo = document.createElement('option');

    optionFrom.value = barra;
    optionFrom.textContent = barra;
    optionTo.value = barra;
    optionTo.textContent = barra;

    selectFrom.appendChild(optionFrom);
    selectTo.appendChild(optionTo);
  });
}

// Función para realizar la transferencia
function transferItem() {
  const selectItem = document.getElementById('select-item');
  const selectFrom = document.getElementById('select-from');
  const selectTo = document.getElementById('select-to');
  const inputQuantity = document.getElementById('quantity');
  const selectUnit = document.getElementById('unit');
  const inputTransfererName = document.getElementById('transferer-name'); // Nuevo campo

  const selectedItem = selectItem.value;
  const selectedFrom = selectFrom.value;
  const selectedTo = selectTo.value;
  const quantity = parseFloat(inputQuantity.value) || 1;
  const unit = selectUnit.value;
  const transfererName = inputTransfererName.value; // Nuevo campo

  // Validar que se haya seleccionado un item, la cantidad sea válida y se haya ingresado un nombre
  if (!selectedItem || isNaN(quantity) || quantity <= 0 || !transfererName) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  // Obtener la hora actual
  const timestamp = new Date().toLocaleString();

  // Buscar si ya existe una transferencia del mismo item a la misma barra
  const existingTransfer = transferencias.find(
    t => t.item === selectedItem && t.from === selectedFrom && t.to === selectedTo && t.unit === unit && t.transfererName === transfererName
  );

  // Si existe, incrementar la cantidad
  if (existingTransfer) {
    existingTransfer.quantity += quantity;
  } else {
    // Si no existe, crear una nueva transferencia
    const transferencia = {
      item: selectedItem,
      from: selectedFrom,
      to: selectedTo,
      quantity: quantity,
      unit: unit,
      timestamp: timestamp,
      transfererName: transfererName, // Nuevo campo
    };

    // Agregar transferencia al array
    transferencias.push(transferencia);
  }

  // Limpiar formularios
  selectItem.value = '';
  selectFrom.value = '';
  selectTo.value = '';
  inputQuantity.value = '';
  inputTransfererName.value = ''; // Nuevo campo

  // Actualizar la lista de transferencias
  updateTransferList();
}


// Función para actualizar la lista de transferencias
function updateTransferList() {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';

  transferencias.forEach(transferencia => {
    const listItem = document.createElement('li');
    listItem.textContent = `${transferencia.item} - De ${transferencia.from} a ${transferencia.to} - ${transferencia.quantity || 1} ${transferencia.unit || 'Cantidad'} - Time: ${transferencia.timestamp.toLocaleString()} - Transferer: ${transferencia.transfererName || 'Anónimo'}`;
    itemList.appendChild(listItem);
  });
}

// Cargar datos iniciales y configurar eventos al cargar la página
window.onload = function () {
  loadItems();
  loadBarras();
  updateTransferList();
};

// Función para exportar transferencias a Excel ordenadas por barra
function exportToExcel() {
  // Ordenar las transferencias por barra, luego por item
  const sortedTransfers = transferencias.sort((a, b) => {
    if (a.to < b.to) return -1;
    if (a.to > b.to) return 1;
    if (a.item < b.item) return -1;
    if (a.item > b.item) return 1;
    return 0;
  });

  // Mapear las transferencias a un formato adecuado para XLSX
  const dataForExcel = sortedTransfers.map(t => ({
    Item: t.item,
    From: t.from,
    To: t.to,
    Quantity: t.quantity,
    Unit: t.unit,
    Timestamp: t.timestamp,
    HostName: t.transfererName || 'Anónimo', // Incluir el nombre del transferente
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataForExcel);
  XLSX.utils.book_append_sheet(wb, ws, 'Transferencias');
  const date = new Date();
  const filename = `transferencias_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

// Asignar la función de exportación al evento del botón
document.getElementById('export-button').addEventListener('click', exportToExcel);






