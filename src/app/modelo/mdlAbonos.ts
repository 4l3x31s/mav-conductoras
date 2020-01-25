export class MdlAbonos {
    constructor(
        public id: number,
        public idConductora: number,
        public monto: number,
        public tipo: string,
        public fecha: string,
        public observaciones: string
    ) {}
}