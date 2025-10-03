import { ApiSettings } from './ApiSettingsTypedef';

export class ApiServices {
    // URL dentro de la clase 
    BASE_URL = ApiSettings;
    
    /**
     * Construir el URL completo para el llamado de las APIs
     * @param {String} endpoint - Archivo destino dentro de las APIs
     * @returns {String} - Enlace completo a una API especifica
     */
    getFullApiUrl(endpoint) {
        return `${this.BASE_URL.BaseApiUrl}/${endpoint}`;
    }

    /**
     * Llamado de la API para verificar los datos de un usuario al iniciar sesión.
     * @param {String} username - Nombre de usuario del usuario que intenta inciar sesión.
     * @param {String} password  - Contraseña del usuario.
     * @returns {null | boolean | JSON} - Nulo en caso de que la petición falle. 
     *  Falso en caso de que los datos ingresados sean incorrectos. 
     *  JSON con ciertos datos del usuario en caso de que las credenciales sean correctas.
     * @throws {Error} - Si ocurre un error al realizar la petición.
     */
    async loginUser(username, password) {
        try {
            const API = this.getFullApiUrl("login.php");
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    usuario: username, 
                    contrasenha: password 
                })
            });

            const data = await response.json().catch(() => null);

            // Verificar si las credenciales son incorrectas.
            if(!data.success) return false;

            // Retornar los datos del usuario si los campos son correctos.
            return {
                id: data.user.id,
                nombres: data.user.nombres,
                usuario: data.user.usuario,
                sid: data.user.token
            }; // 
        } catch (error) {
            console.error('Ocurrió un error al intentar logear el usuario:', error);
            throw error;
        }
    } 

    /**
     * Llamado de la API para validar que identificador de la sesión sea válido.
     * @param {String} sid - Identificador único de la sesión del usuario.
     * @returns {null | boolean} - Nulo si ocurre un error al realizar la petición. 
     *  False si la SID no es válida. True si la SID es válida.
     * @throws {Error} - Cuando ocurre un error en la petición.
     */
    async validateSID(sid) {
        try {
            const API = this.getFullApiUrl("validateSid.php");
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sid: sid })
            });

            const data = await response.json().catch(() => null);

            return data.success;

        } catch (error) {
            console.error('Ocurrió un error al validar el SID:', error);
            throw error;
        }
    }

    /**
     * Obtiene una lista de usuarios.
     * @param {String} sid - Identificador único de la sesión del usuario.
     * @param {String} id - ID del usuario superior para filtrar.
     * @returns {Array | null} - Un array de objetos de usuario si la petición es exitosa, un array vacío si no hay usuarios, o nulo si ocurre un error.
     */
    async getUsers(sid, id) {
        try {
            const API = this.getFullApiUrl(`getUsers.php?sid=${sid}&superior=${id}`);
            const response = await fetch(API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                console.error(`Error fetching users: ${response.status}`);
                return null;
            }

            const data = await response.json().catch(() => {
                console.error('Failed to parse JSON response from getUsers');
                return null;
            });
            
            return data;

        } catch (error) {
            console.error('Ocurrió un error al obtener los usuarios:', error);
            return null;
        }
    }

    /**
     * Obtiene los detalles de un usuario específico por su ID.
     * @param {String} sid - Identificador único de la sesión del usuario.
     * @param {String} userId - ID del usuario a buscar.
     * @returns {Object | null} - Un objeto con los datos del usuario si la petición es exitosa,
     *  o nulo si el usuario no se encuentra o si ocurre un error.
     * @throws {Error} - Si ocurre un error al realizar la petición.
     */
    async getUserById(sid, userId) {
        try {
            const API = this.getFullApiUrl(`getUserById.php?sid=${sid}&id=${userId}`);
            const response = await fetch(API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json().catch(() => null);
            return data;
        } catch (error) {
            console.error('Ocurrió un error al obtener el usuario:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo usuario en el sistema.
     * @param {String} sid - Identificador único de la sesión del usuario.
     * @param {String} id - ID del usuario superior que crea el nuevo usuario.
     * @param {Object} userData - Objeto que contiene los datos del nuevo usuario a crear.
     * @returns {Object | null} - Un objeto con la respuesta de la API si la creación es exitosa,
     *  o nulo si ocurre un error.
     * @throws {Error} - Si ocurre un error al realizar la petición.
     */
    async createUser(sid, id, userData) {
        try {
            const API = this.getFullApiUrl(`createUser.php?sid=${sid}&superior=${id}`);
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json().catch(() => null);
            return data;
        } catch (error) {
            console.error('Ocurrió un error al crear el usuario:', error);
            throw error;
        }
    }

    /**
     * Actualiza los datos de un usuario existente en el sistema.
     * @param {String} sid - Identificador único de la sesión del usuario.
     * @param {String} userId - ID del usuario a actualizar.
     * @param {Object} userData - Objeto que contiene los nuevos datos del usuario.
     * @returns {Object | null} - Un objeto con la respuesta de la API si la actualización es exitosa,
     *  o nulo si ocurre un error.
     * @throws {Error} - Si ocurre un error al realizar la petición.
     */
    async updateUser(sid, userId, userData) {
        try {
            const API = this.getFullApiUrl(`updateUser.php?sid=${sid}&id=${userId}`);
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json().catch(() => null);
            return data;
        } catch (error) {
            console.error('Ocurrió un error al actualizar el usuario:', error);
            throw error;
        }
    }

    /**
     * Elimina un usuario existente del sistema.
     * @param {String} sid - Identificador único de la sesión del usuario.
     * @param {String} superiorId - ID del usuario superior que realiza la eliminación.
     * @param {String} userId - ID del usuario a eliminar.
     * @returns {Object | null} - Un objeto con la respuesta de la API si la eliminación es exitosa,
     *  o nulo si ocurre un error.
     * @throws {Error} - Si ocurre un error al realizar la petición.
     */
    async deleteUser(sid, superiorId, userId) {
        try {
            const API = this.getFullApiUrl(`deleteUser.php?sid=${sid}&superior=${superiorId}`);
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            });
            const data = await response.json().catch(() => null);
            return data;
        } catch (error) {
            console.error('Ocurrió un error al eliminar el usuario:', error);
            throw error;
        }
    }
};