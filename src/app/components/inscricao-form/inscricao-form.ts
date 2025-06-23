import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { InscricaoService } from '../../services/inscricao.service';
import { InscricaoConvidado } from '../../models/inscricao.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscricao-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './inscricao-form.html',
  styleUrl: './inscricao-form.scss'
})
export class InscricaoForm implements OnInit {
  inscricaoForm!: FormGroup;
  token!: string;
  loading = false;
  submitted = false;
  success = false;


  // Opções para os campos de seleção
  religioes = [
    'Adventista do 7º Dia',
    'evangélica',
    'espírita',
    'católica',
    'Outras Denominações',
    'Cristão',
    'outra',
    'sem religião'
  ];

  dietasAlimentares = [
    'não',
    'ovolactovegetariano',
    'vegetariano',
    'vegano'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inscricaoService: InscricaoService,
    private snackBar: MatSnackBar
  ) { }

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Capturar o token da URL

    this.token = this.activatedRoute.snapshot.paramMap.get('token') || '';
    console.log('Token capturado:', this.token);
    if (!this.token) {
      this.snackBar.open('URL inválida. Token não encontrado.', 'Fechar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Validar o token
    console.log('Validando token:', this.token);
    this.loading = true;
    this.snackBar.open('Validando token, por favor aguarde...', 'Fechar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
    this.validarToken();

    // Inicializar o formulário
    this.inicializarFormulario();
  }

  validarToken(): void {
    this.loading = true;
    this.inscricaoService.validarToken(this.token).subscribe({
      next: (response) => {
        this.loading = false;
        // Token válido, continuar com o formulário
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('URL inválida ou expirada. Por favor, solicite um novo link.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  inicializarFormulario(): void {
    this.inscricaoForm = this.fb.group({
      casal: this.fb.group({
        data_casamento: [''],
        endereco: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        cep: ['', Validators.required],
        contato_emergencia_nome1: [''],
        contato_emergencia_telefone1: [''],
        contato_emergencia_nome2: [''],
        contato_emergencia_telefone2: [''],
        responsavel_filhos_nome: [''],
        responsavel_filhos_telefone: ['']
      }),
      pessoas: this.fb.array([
        this.criarPessoaFormGroup('esposo'),
        this.criarPessoaFormGroup('esposa')
      ]),
      filhos: this.fb.array([])
    });
  }

  criarPessoaFormGroup(tipo: 'esposo' | 'esposa'): FormGroup {
    return this.fb.group({
      tipo: [tipo],
      nome_completo: ['', Validators.required],
      nome_social: [''],
      data_nascimento: [''],
      profissao: [''],
      email: ['', Validators.email],
      celular: [''],
      rg: [''],
      rg_emissor: [''],
      cpf: [''],
      problema_saude: [false],
      problema_saude_descricao: [''],
      medicamento_especial: [false],
      medicamento_especial_descricao: [''],
      diabetico: [false],
      dieta_alimentar: ['não'],
      religiao: ['católica', Validators.required]
    });
  }

  criarFilhoFormGroup(): FormGroup {
    return this.fb.group({
      nome_completo: ['', Validators.required],
      data_nascimento: ['']
    });
  }

  get pessoasFormArray(): FormArray {
    return this.inscricaoForm.get('pessoas') as FormArray;
  }

  get filhosFormArray(): FormArray {
    return this.inscricaoForm.get('filhos') as FormArray;
  }

  adicionarFilho(): void {
    this.filhosFormArray.push(this.criarFilhoFormGroup());
  }

  removerFilho(index: number): void {
    this.filhosFormArray.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;

    // Verificar se o formulário é válido
    if (this.inscricaoForm.invalid) {
      this.snackBar.open('Por favor, corrija os erros no formulário antes de enviar.', 'Fechar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.loading = true;

    // Preparar dados para envio
    const inscricao: InscricaoConvidado = {
      ...this.inscricaoForm.value,
      token: this.token
    };

    // Enviar inscrição
    this.inscricaoService.enviarInscricao(inscricao).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.snackBar.open('Inscrição efetuada com sucesso!', 'Fechar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erro ao enviar inscrição. Por favor, tente novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}


