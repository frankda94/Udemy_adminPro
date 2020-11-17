
interface _Hospital_medico {
    nombre: string;
    _id: string;
    img?: string;
}

export class Medico {

    constructor(
        public nombre?: string,
        public img?: string,
        public usuario?: string,
        public hospital?: _Hospital_medico,
        public _id?: string
    ) { }
}
