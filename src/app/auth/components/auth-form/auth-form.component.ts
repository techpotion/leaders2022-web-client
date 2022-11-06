import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { combineLatest, filter, map, merge, startWith, takeUntil } from 'rxjs';

import { slideBelowAnimation } from 'src/app/shared/animations/slide-below.animation';
import { Credentials } from '../../models/credentials';
import { AuthService } from '../../services/auth.service';


enum AuthFormError {
  WrongValues = 'wrongValues',
  InvalidForm = 'invalidForm',
}

@Component({
  selector: 'tp-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideBelowAnimation(),
  ],
})
export class AuthFormComponent implements OnDestroy {

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AuthService,
  ) {
    this.subscribeCredentialsSending();
  }


  // #region Lifecycle

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Submit

  public readonly submit = new EventEmitter<SubmitEvent>();

  private subscribeCredentialsSending(): void {
    this.submit.pipe(
      takeUntil(this.destroy$),
      filter(() => this.form.valid),
    ).subscribe(event => {
      event.preventDefault();
      void this.sendCredentials();
    });
  }

  private async sendCredentials(): Promise<void> {
    try {
      await this.service.signIn(this.form.value as Credentials);
    } catch (e) {
      console.warn(e);
      this.authError.emit();
      return;
    }

    this.authorization.emit();
  }

  public readonly authError = new EventEmitter<void>();

  @Output()
  public readonly authorization = new EventEmitter<void>();

  // #endregion


  // #region Controls

  public readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // #endregion


  // #region Validity

  private readonly formIsValid = merge(
    this.form.valueChanges.pipe(
      map(() => true),
    ),
    this.submit.pipe(
      map(() => this.form.valid),
    ),
  );

  private readonly valuesAreWrong = merge(
    this.form.valueChanges.pipe(
      map(() => false),
    ),
    this.authError.pipe(
      map(() => true),
    ),
  );

  public readonly authFormError = AuthFormError;

  public readonly error$ = combineLatest([
    this.formIsValid.pipe(
      startWith(true),
    ),
    this.valuesAreWrong.pipe(
      startWith(false),
    ),
  ]).pipe(
    map(([formIsValid, valuesAreWrong]) => {
      if (!formIsValid) {
        return AuthFormError.InvalidForm;
      }
      if (valuesAreWrong) {
        return AuthFormError.WrongValues;
      }
      return null;
    }),
  );

  public readonly usernameInputIsInvalid = this.error$.pipe(
    map(error => error === AuthFormError.WrongValues
      || error && this.form.controls.username.invalid),
  );

  public readonly passwordInputIsInvalid = this.error$.pipe(
    map(error => error === AuthFormError.WrongValues
      || error && this.form.controls.password.invalid),
  );

  // #endregion

}
