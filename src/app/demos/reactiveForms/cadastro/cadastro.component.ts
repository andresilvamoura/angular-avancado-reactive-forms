import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styles: []
})
export class CadastroComponent implements OnInit {

  cadastroForm: FormGroup;
  usuario: Usuario;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: [''],
      email: [''],
      senha: [''],
      senhaConfirmacao: ['']
    });
  }

  adicionarUsuario(){
    this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
  }

}
