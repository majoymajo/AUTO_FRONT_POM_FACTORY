## Reglas de formato JSDoc

Este documento define formatos estándar de JSDoc para documentar clases, componentes React, hooks y funciones complejas en el proyecto.

### 1. Clases y componentes complejos

Usa este formato para clases de lógica de dominio o componentes de clase de React con comportamiento complejo.

````ts
/**
 * Descripción breve de la clase/componente.
 *
 * Descripción más detallada si es necesario: propósito, responsabilidades
 * y cómo debe usarse.
 *
 * @class NombreDeLaClase
 * @extends React.Component
 *
 * @example
 * ```tsx
 * <NombreDeLaClase propImportante="valor" />
 * ```
 */
class NombreDeLaClase extends React.Component {
	/**
	 * Crea una instancia de NombreDeLaClase.
	 *
	 * @param {Object} props - Props del componente.
	 * @param {string} props.algunProp - Descripción de la prop.
	 * @param {number} [props.opcional] - Prop opcional.
	 */
	constructor(props) {
		super(props);
	}

	/**
	 * Descripción de un método de instancia complejo.
	 * Explica qué hace, en qué casos se usa y efectos secundarios.
	 *
	 * @param {number} id - Identificador del recurso.
	 * @param {Object} opciones - Opciones adicionales.
	 * @param {boolean} opciones.forzar - Si debe forzar la recarga.
	 * @param {(resultado: Object) => void} [onSuccess] - Callback en éxito.
	 * @param {(error: Error) => void} [onError] - Callback en error.
	 * @returns {Promise<Object>} Promesa con el resultado del API.
	 * @throws {TypeError} Si los parámetros no son válidos.
	 * @throws {Error} Si la petición falla.
	 * @async
	 */
	async cargarDatos(id, opciones, onSuccess, onError) {
		// ...
	}

	/**
	 * Método de render de React.
	 *
	 * @returns {JSX.Element} Elemento JSX a renderizar.
	 */
	render() {
		return (
			// ...
		);
	}
}
````

### 2. Hooks personalizados complejos

Usa este formato para hooks que gestionan lógica de negocio, side effects o flujos de datos complejos.

````ts
/**
 * Hook que gestiona el estado de autenticación del usuario.
 * Maneja login, logout y refresco del token.
 *
 * @function useAuth
 * @param {Object} [config] - Configuración opcional del hook.
 * @param {string} [config.endpointLogin='/api/login'] - Endpoint de login.
 * @param {string} [config.endpointRefresh='/api/refresh'] - Endpoint de refresco.
 *
 * @returns {{
 *   usuario: Object|null,
 *   cargando: boolean,
 *   error: Error|null,
 *   login: (credenciales: {email: string, password: string}) => Promise<void>,
 *   logout: () => void
 * }} Objeto con el estado y acciones de autenticación.
 *
 * @example
 * ```tsx
 * const { usuario, login, logout } = useAuth();
 * ```
 */
export function useAuth(config) {
  // ...
}
````

### 3. Funciones utilitarias complejas

Usa este formato para funciones puras o helpers con múltiples parámetros y reglas de negocio.

````ts
/**
 * Calcula el puntaje de un kudo según sus atributos.
 *
 * @param {Object} kudo - Kudo a evaluar.
 * @param {number} kudo.impacto - Impacto percibido.
 * @param {number} kudo.colaboracion - Nivel de colaboración.
 * @param {number} [kudo.innovacion] - Nivel de innovación.
 * @param {Object} [opciones] - Opciones adicionales.
 * @param {number} [opciones.factorEquipo=1] - Factor por equipo.
 * @returns {number} Puntaje calculado.
 *
 * @example
 * ```ts
 * const score = calcularPuntajeKudo({ impacto: 3, colaboracion: 5 });
 * ```
 */
export function calcularPuntajeKudo(kudo, opciones) {
  // ...
}
````

### 4. Métodos de servicios / API clients

Usa este formato para métodos que llamen a APIs remotas o integraciones externas.

````ts
/**
 * Obtiene la lista paginada de kudos desde el API.
 *
 * @param {Object} filtros - Filtros de búsqueda.
 * @param {number} filtros.page - Página actual.
 * @param {number} filtros.size - Tamaño de página.
 * @param {string} [filtros.usuarioId] - Filtrar por usuario.
 * @returns {Promise<{items: Object[], total: number}>} Lista de kudos y total.
 *
 * @example
 * ```ts
 * const { items, total } = await fetchKudos({ page: 1, size: 10 });
 * ```
 */
export async function fetchKudos(filtros) {
  // ...
}
````
