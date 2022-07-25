# Curso Avançado de Angular - Reactive Forms

Os formulários reativos fornecem uma abordagem baseada em modelo para lidar com entradas de formulário cujos valores mudam ao longo do tempo.  <br>
Iremos criar e atualizar um controle de formulário, usar controles em grupos e validar valores de formulários. 

## Conteúdo


* [Form Controls e Form Groups](https://github.com/andresilvamoura/angular-avancado-reactive-forms/edit/master/README.md#form-controls-e-form-groups)
* [Form Builder](https://github.com/andresilvamoura/angular-avancado-reactive-forms/edit/master/README.md#form-builder)
* [Transformando formulário em objetos](https://github.com/andresilvamoura/angular-avancado-reactive-forms/edit/master/README.md#transformando-formul%C3%A1rio-em-objetos)
* [Validação básicas](https://github.com/andresilvamoura/angular-avancado-reactive-forms/edit/master/README.md#valida%C3%A7%C3%A3o-b%C3%A1sicas)
* [Validação customizada](https://github.com/andresilvamoura/angular-avancado-reactive-forms/edit/master/README.md#valida%C3%A7%C3%A3o-customizada)
* [Validação Avançada](https://github.com/andresilvamoura/angular-avancado-reactive-forms/edit/master/README.md#valida%C3%A7%C3%A3o-avan%C3%A7ada)

##  Form Controls e Form Groups

Criando um formulário básico, iniciar fazendo os imports necessários. 


~~~typescript
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


 imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    [RouterModule.forRoot(rootRouterConfig, { useHash: false})]
  ],
~~~

Criar o html do formulário. <br>
Exemplo de formulário html com bootstrap, campo nome e button submit:

~~~typescript
<div class="container main-container">
    <h4>Demo Cadastro</h4>
    <hr />
    <form novalidate>
        <div class="form-horizontal">
            <div class="form-group">
                <label class="col-md-2 control-label" for="nome">Nome Completo</label>
                <div class="col-md-10">
                    <input class="form-control" id="nome" type="text" placeholder="Nome (requerido)" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-4 col-md-offset-2">
                    <span><button class="btn btn-success" id="Registrar" type="submit">Registrar</button></span>
                </div>
            </div>
        </div>
    </form>
</div>
~~~

No component.ts dentro do ngOnInit(), por que é o primeiro método  que é chamado após a construção do componente, devemos criar os campos do nosso formulário. <br>
Exemplo do campo nome:

~~~typescript
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styles: []
})

export class CadastroComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    let nome = new FormControl('');
  }
}
~~~

E para associar ao formulário no html, adicionar a referencia formControlName="nomeDoCampo".

~~~typescript
<div class="col-md-10">
	<input class="form-control" id="nome" type="text" placeholder="Nome (requerido)" formControlName="nome" />
</div>
~~~


Para submeter todos os campos do seu formulário juntos você deve trabalhar isso em grupo.
devemos criar um formGroup. <br>

Inicialmente devemos declarar uma variável do tipo FormGroup
~~~typescript
  cadastroForm: FormGroup;
~~~
No ngOnInit() devemos instanciar a variável criada e dentro dele declarar os elementos do formulário.

~~~typescript
import { FormControl, FormGroup } from '@angular/forms';

export class CadastroComponent implements OnInit {

  cadastroForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.cadastroForm = new FormGroup({
      nome: new FormControl('')
    })
  }
}
~~~
 Agora iremos associar o nosso grupo no html.
~~~typescript
    <form novalidate [formGroup]="cadastroForm">
~~~
Para submeter um formulário no Angular precisamos do evento (ngSubmit)="seuMetodo()" 

~~~typescript
<form novalidate (ngSubmit)="adicionarUsuario()" [formGroup]="cadastroForm">
~~~


##  Form Builder

Form Builder pode ser considerado uma API para construção de formularios. <br>
Para utilizar devemos fazer a injeção de dependência dele.<br>
Vamos injeta-lo no construtor.

~~~typescript
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

constructor(private formBuilder: FormBuilder) { }
~~~
Após injeta-lo fazer usar o seu metódo .group no ngOnInit()

~~~typescript
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: [''],
      cpf: [''],
      email: [''],
      senha: [''],
      senhaConfirmacao: ['']
    })
  }
~~~

##  Transformando formulário em objetos

Criar a classe Usuario:

~~~typescript
export interface Usuario {
    id: string;
    nome: string;
    CPF: string;
    email: string;
    senha: string;
    senhaConfirmacao: string;
}
~~~

declarar a implementação dessa classe na aplicação.

~~~typescript
import { Usuario } from './models/usuario';
usuario: Usuario;
~~~

Dentro do método usado no submit, devemos atribuir fazendo um mapeamento de um objeto para o outro.
~~~typescript
  adicionarUsuario() {
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
  }
~~~

##  Validação básicas

As validações de formulário no Angular podem ser feitas de duas maneiras,  validando as entradas em _template-driven forms_(formulários orientados por modelos) ou validando as entradas em _reactive forms_(formulários reativos).

####  Validating input in template-driven forms:

Para adicionar validação a um formulário orientado por modelo, você adiciona os mesmos atributos de validação que faria com validação de formulário HTML nativo.


~~~typescript
            <label for="name">Name</label>
            <input type="text" id="name" class="form-control" formControlName="name" required>
            <div *ngIf="name.invalid && (name.dirty || name.touched)" class="alert alert-danger">
                <div *ngIf="name.errors?.['required']">
                    Name is required.
                </div>
                <div *ngIf="name.errors?.['minlength']">
                    Name must be at least 4 characters long.
                </div>
                <div *ngIf="name.errors?.['forbiddenName']">
                    Name cannot be Bob.
                </div>
            </div>
  ~~~

###  Validating input in reactive forms:

Existem duas maneiras de fazer validações de formulários reativo. <br>

Validação de forma **síncrona**: valida com base nos eventos de formulário e retorna imediatamente se ocorrer um erro no preenchimento do item. <br>

Validação de forma **assíncrona**: usa uma promise ou observable que vai observar algum tipo de evento e disparar as validações do formulário. <br>

Nós usamos os Validators que são objetos de validação. <br>

No seguinte exemplo iremos validar se o campo nome foi preenchido(required). <br>

~~~typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: [''],
      email: [''],
      senha: [''],
      senhaConfirmacao: ['']
    });
  }

~~~

Usamos alguns controles de formulários, como touched para quando o formulário for tocado e dirty para quando o formulário for preenchido. <br>
No seguinte exemplo usaremos esses controles para exibir ou não as mensagens de erro no html. 

~~~typescript
<input class="form-control" id="nome" type="text" placeholder="Nome (requerido)" formControlName="nome"/>
<span class="text-danger" 
*ngIf="cadastroForm.get('nome').errors && (cadastroForm.get('nome').touched || cadastroForm.get('nome').dirty)">
     <p>Preencha o campo nome</p>
</span>
~~~


Podemos também usar Diretivas para customizar nossas validações.<br>
No seguinte exemplo iremos usar a diretiva [ngClass] que adiciona uma classe de estilo.


~~~typescript
<input class="form-control" id="nome" type="text" placeholder="Nome (requerido)" formControlName="nome"
[ngClass]="{'is-invalid': cadastroForm.get('nome').errors && (cadastroForm.get('nome').touched || cadastroForm.get('nome').dirty)}"/>
<span class="text-danger" *ngIf="cadastroForm.get('nome').errors && (cadastroForm.get('nome').touched || cadastroForm.get('nome').dirty)">
     <p>Preencha o campo nome</p>
</span>
~~~
 
Para Validar o envio do Formulário: <br>
Podemos desabilitar o botão de envio com uma propriedade html com seu estado gerenciado pelo Angular: [disabled]="!cadastroForm.valid"

~~~typescript
<div class="col-md-4 col-md-offset-2">
    <span><button class="btn btn-success" [disabled]="!cadastroForm.valid" id="Registrar" type="submit">Registrar</button></span>
</div>
~~~

Podemos também colocar condições no método de envio:

~~~typescript
adicionarUsuario() {
  if (this.cadastroForm.dirty && this.cadastroForm.valid) {
    this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
    this.formResult = JSON.stringify(this.cadastroForm.value);
  }
}
~~~

Para fazer um conjunto de validações usamos um array. <br>
No exemplo o campo email.

~~~typescript
ngOnInit() {
  this.cadastroForm = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: [''],
    email: ['',[Validators.required , Validators.email]],
    senha: [''],
    senhaConfirmacao: ['']
  });
}
~~~

Quando usamos mais de uma validação por campo, pode ser que uma validação retorne null, e continue com erro, então usamos o unsafe ? para mitigar  esse criterio.

~~~typescript
<label class="col-md-2 control-label">E-mail</label>
<div class="col-md-10">
    <input class="form-control" id="email" type="text" placeholder="E-mail (requerido)" formControlName="email"/>
</div>
<span class="text-danger" *ngIf="cadastroForm.get('email')?.errors?.required && (cadastroForm.get('email').touched || cadastroForm.get('email').dirty)">
    <p>Preencha o campo email</p>
</span>
<span class="text-danger" *ngIf="cadastroForm.get('email')?.errors?.email && (cadastroForm.get('email').touched || cadastroForm.get('email').dirty)">
    <p>Email em formato inválido</p>
</span>
~~~

##  Validação customizada

Validação usando libs. <br>
Usaremos a lib ng-brazil. Primeiro instalar a lib com o comando npm i ng-brazil

~~~bash
$ npm i ng-brazil
~~~

E para usar as máscaras usar o comando:  npm install --save ng-brazil angular2-text-mask

~~~bash
$ npm install --save ng-brazil angular2-text-mask
~~~

Importar o módulo no arquivo de módulo:

~~~typescript
import { NgBrazil, TextMask } from 'ng-brazil';


  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TextMask.TextMaskModule,
    NgBrazil,
  ],
~~~

E para usar no componente:

~~~typescript
import { NgBrazilValidators } from 'ng-brazil';


ngOnInit() {
  this.cadastroForm = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    senhaConfirmacao: ['']
  });
}
~~~

E para usar as máscaras:

~~~typescript
import { utilsBr } from 'js-brasil'

MASKS = utilsBr.MASKS;
~~~

No html:  cpf [textMask]="{mask: MASKS.cpf.textMask}"

~~~typescript
<div class="col-md-10">
    <input class="form-control" id="cpf" type="text" 
	placeholder="CPF (requerido)" formControlName="cpf" 
	cpf [textMask]="{mask: MASKS.cpf.textMask}"/>
</div>

 ~~~

Para validar outros campos no formulário que não tenha cobertura no validador padrão, podemos usar outra lib, ng2-validation. <br> 
Para instalar o seguinte comando: 

~~~bash
$ npm install ng2-validation
~~~

Como exemplo vamos colocar validação de tamanho na senha: <br>
Importar o módulo

~~~typescript
import { CustomFormsModule } from 'ng2-validation';


  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TextMask.TextMaskModule,
    NgBrazil,
    CustomFormsModule,
  ],
~~~

Uso no componente:

~~~typescript
import { CustomValidators } from 'ng2-validation';



  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [CustomValidators.rangeLength([6, 15])]],
      senhaConfirmacao: ['']
    });
  }
~~~

 No html:

~~~typescript
<label class="col-md-2 control-label">Senha</label>
<div class="col-md-10">
    <input class="form-control" id="senha" 
	type="password" placeholder="Senha (requerido)" formControlName="senha"/>
</div>
<span class="text-danger" 
*ngIf="cadastroForm.get('senha')?.errors?.rangeLength && (cadastroForm.get('senha').touched || cadastroForm.get('senha').dirty)">
    <p>Tamanho inválido</p>
</span>
~~~

Para comparar campos, por exemplo se as senhas conferem, precisar ser feito uma estratégia diferente. <br>
Devemos criar o campo senha em um form control separado, para podermos compara-lo, e depois atribui-lo ao campo dentro do seu grupo de formulário. 


~~~typescript
ngOnInit() {
  let senha = new FormControl 
  ('', [Validators.required, CustomValidators.rangeLength([6,15])]);

  let senhaConfirmacao = new FormControl 
  ('', [Validators.required, CustomValidators.rangeLength([6,15]), CustomValidators.equalTo(senha)]);

  this.cadastroForm = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
    email: ['', [Validators.required, Validators.email]],
    senha: senha,
    senhaConfirmacao: senhaConfirmacao
  });
}
~~~

##  Validação Avançada

Para Criarmos uma validação avançada, usaremos um arquivo que contém duas interfaces a DisplayMessage e a ValidationMessage. <br>
A DisplayMessage é uma coleção de chave e valor, e a ValidationMessage é uma matriz que tem uma coleção de chave valor, que para cada item dessa chave temos uma coleção de itens chave e valor.

No arquivo temos um método processarMensagens() que recebe como parâmetro essa coleção de mensagem e processa elas conforme o FormGroup, temos um **for** que para cada item do controle é verificado se existe mensagens para ser associadas conforme a validação desse formulário, com base na validação ele verifica se o campo está sujo se foi tocado e se possui erros de validação, conforme ele possuir ele ira pegar as mensagens de validação que iremos criar e irá atribuir para cada um desses erros do formulário.

~~~typescript
export interface DisplayMessage {
    [key: string]: string
}
export interface ValidationMessages {
    [key: string]: { [key: string]: string } 
}


import { FormGroup } from '@angular/forms';

export class GenericValidator {

    constructor(private validationMessages: ValidationMessages) { }

    processarMensagens(container: FormGroup): { [key: string]: string } {
        let messages = {};
        for (let controlKey in container.controls) {
            if (container.controls.hasOwnProperty(controlKey)) {
                let c = container.controls[controlKey];
                if (c instanceof FormGroup) {
                    let childMessages = this.processarMensagens(c);
                    Object.assign(messages, childMessages);
                } else {
                    if (this.validationMessages[controlKey]) {
                        messages[controlKey] = '';
                        if ((c.dirty || c.touched) && c.errors) {
                            Object.keys(c.errors).map(messageKey => {
                                if (this.validationMessages[controlKey][messageKey]) {
                                    messages[controlKey] += this.validationMessages[controlKey][messageKey] + '<br />';
                                }
                            });
                        }
                    }
                }
            }
        }
        return messages;
    }
}
~~~



No componente de formulário iremos implementar essas validações, criaremos primeiramente os três seguintes itens:

~~~typescript
import { DisplayMessage, GenericValidator, ValidationMessages } from './generic-form-validation';



  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
~~~


No construtor vamos configurar o conjunto de mensagens de validação, baseado nos campos e seus Validators. <br>
Depois criaremos uma instância do Genericvalidator que receberá nosso conjunto de mensagem como parâmetro.

~~~typescript
  constructor(private formBuilder: FormBuilder) {
    this.validationMessages = {
      nome: {
        required: 'O nome é requirido',
        minlength: 'O nome precisa ter no mínimo 2 carateres',
        maxlength: 'O nome precisa ter no máximo 150 carateres'
      },
      cpf: {
        required: 'Informe o CPF',
        cpf: 'CPF em formato inválido'
      },
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      senha: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      senhaConfirmacao: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }
~~~

Depois que a view for iniciada iremos configurar como a validação vai funcionar, usando o @AfterViewInit(). <br>
Então precisamos implementa-la, 

~~~typescript
import { AfterViewInit, Component, OnInit } from '@angular/core';

export class CadastroComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {

  }
~~~

Precisamos obter do html  do formulário uma coleção de itens. 

~~~typescript
@ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
~~~

Agora no ngAfterViewInit  iremos criar uma coleção de  Observables que será disparada a cada item do formulário através do evento blur. <br>
Por termos vários itens de formulário iremos fazer através do operador merge() um subscribe em todos os itens dessa coleção de Observables, para que seja chamado  processarMensagens() toda vez que a Observable for disparada através do blur.


~~~typescript
ngAfterViewInit(): void {
  let controlBlurs: Observable<any>[] = this.formInputElements
  .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

  merge(...controlBlurs).subscribe(() => {
    this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
  });
}
~~~

Finalmente no HTML iremos usar nossos itens de Validação criados.
como exemplo:


~~~typescript
<div class="form-group">
    <label class="col-md-2 control-label" for="nome">Nome Completo</label>
    <div class="col-md-10">
        <input class="form-control" id="nome" type="text" 
	    placeholder="Nome (requerido)" formControlName="nome"
        [ngClass]="{'is-invalid': displayMessage.nome}"/>
        <span class="text-danger" *ngIf="displayMessage.nome">
            <p [innerHTML]="displayMessage.nome"></p>
        </span>
    </div>
</div>
