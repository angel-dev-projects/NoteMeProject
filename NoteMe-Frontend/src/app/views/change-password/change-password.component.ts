import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  decodedToken: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    // Inicializa el formulario de cambio de contraseña
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Obtiene el usuario actual del servicio de autenticación
    this.decodedToken = this.authService.getUser();
  }

  changePassword() {
    // Realiza una solicitud para cambiar la contraseña del usuario actual
    this.userService
      .changePassword(this.decodedToken._id, this.passwordForm.value)
      .subscribe(
        (res) => {
          // La contraseña se cambió exitosamente, muestra un mensaje de éxito y redirige al usuario a la página principal
          this.toastService.initiate({
            title: 'Password updated',
            content: `Your password has been changed successfully`,
          });
          this.router.navigate(['/profile']);
        },
        (err) => {
          // Se produjo un error al cambiar la contraseña, muestra un mensaje de error y establece el mensaje de error personalizado
          this.toastService.initiate({
            title: 'Error',
            content: err.error.errors[0].msg,
          });
        }
      );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    // Validador personalizado para verificar si las contraseñas coinciden
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      // Si las contraseñas no coinciden, se devuelve un objeto con la clave 'passwordMismatch' para indicar el error
      return { passwordMismatch: true };
    }

    // Si las contraseñas coinciden, se devuelve null para indicar que no hay errores
    return null;
  };
}
