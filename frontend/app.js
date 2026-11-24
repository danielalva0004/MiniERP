const facturas = [];
let siguienteId = 1;

const formulario = document.getElementById("form-factura");
const campoCliente = document.getElementById("cliente");
const campoConcepto = document.getElementById("concepto");
const campoValor = document.getElementById("valor");
const campoEstado = document.getElementById("estado");
const errorFormulario = document.getElementById("error-formulario");
const tablaFacturas = document.getElementById("facturas");
const tituloFacturas = document.getElementById("titulo-facturas");
const totalFacturado = document.getElementById("total-facturado");
const dineroPendiente = document.getElementById("dinero-pendiente");
const totalFacturas = document.getElementById("total-facturas");

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 20
});

function mostrarError(mensaje, campo) {
  errorFormulario.textContent = mensaje;
  campo.focus();
}

function agregarCelda(fila, texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  fila.append(celda);
  return celda;
}

function eliminarFactura(id) {
  const indice = facturas.findIndex(factura => factura.id === id);
  if (indice === -1) return;

  facturas.splice(indice, 1);
  actualizarPanel();
  tituloFacturas.focus();
}

function actualizarPanel() {
  let facturado = 0;
  let pendiente = 0;
  tablaFacturas.replaceChildren();

  for (const factura of facturas) {
    facturado += factura.valor;
    if (factura.estado === "Pendiente") {
      pendiente += factura.valor;
    }

    const fila = document.createElement("tr");
    agregarCelda(fila, factura.id);
    agregarCelda(fila, factura.cliente);
    agregarCelda(fila, factura.concepto);
    agregarCelda(fila, formatoCOP.format(factura.valor));

    const estado = document.createElement("span");
    estado.className = "estado " + factura.estado.toLowerCase();
    estado.textContent = factura.estado;
    agregarCelda(fila, "").append(estado);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "eliminar";
    boton.textContent = "Eliminar";
    boton.setAttribute("aria-label", "Eliminar factura " + factura.id);
    boton.addEventListener("click", () => eliminarFactura(factura.id));
    agregarCelda(fila, "").append(boton);

    tablaFacturas.append(fila);
  }

  if (facturas.length === 0) {
    const fila = document.createElement("tr");
    agregarCelda(fila, "No hay facturas registradas.").colSpan = 6;
    tablaFacturas.append(fila);
  }

  totalFacturado.textContent = formatoCOP.format(facturado);
  dineroPendiente.textContent = formatoCOP.format(pendiente);
  totalFacturas.textContent = facturas.length;
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();

  const cliente = campoCliente.value.trim();
  const concepto = campoConcepto.value.trim();
  const valor = Number(campoValor.value);
  const estado = campoEstado.value;

  if (!cliente) return mostrarError("Escribe el nombre del cliente.", campoCliente);
  if (!concepto) return mostrarError("Escribe el concepto de la factura.", campoConcepto);
  if (!Number.isFinite(valor) || valor <= 0) {
    return mostrarError("Ingresa un valor numérico mayor que cero.", campoValor);
  }
  if (estado !== "Pagada" && estado !== "Pendiente") {
    return mostrarError("Selecciona el estado de la factura.", campoEstado);
  }

  facturas.push({ id: siguienteId, cliente, concepto, valor, estado });
  siguienteId++;
  formulario.reset();
  errorFormulario.textContent = "";
  actualizarPanel();
  campoCliente.focus();
});
