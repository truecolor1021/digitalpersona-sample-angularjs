import { IComponentOptions } from 'angular';
import { Credential } from "@digitalpersona/core";
import { PinAuth } from '@digitalpersona/authentication';
import { IAuthService, ServiceError } from '@digitalpersona/services';

import { TokenAuth } from '../tokenAuth';
import template from './pinAuth.html';

export default class PinAuthControl extends TokenAuth
{
    public static readonly Component: IComponentOptions = {
        ...TokenAuth.Component,
        template,
        controller: PinAuthControl,
    };

    private pin: string;
    private showPin: boolean = false;

    public static $inject = ["AuthService"];
    constructor(
        private authService: IAuthService,
    ){
        super(Credential.PIN);
    }

    public updatePin(value: string) {
        this.pin = value || "";
        super.resetError();
    }

    public submit() {
        super.emitOnBusy();
        new PinAuth(this.authService)
            .authenticate(this.identity, this.pin)
            .then(token => super.emitOnToken(token))
            .catch(error => super.emitOnError(new Error(this.mapServiceError(error))));
    }

    protected mapServiceError(error: ServiceError) {
        switch (error.code) {
            case -2146893044: return "PIN.Auth.Error.NoMatch";
            case -2147024894: return "PIN.Auth.Error.NotEnrolled";
            default: return super.mapServiceError(error);
        }
    }
}
