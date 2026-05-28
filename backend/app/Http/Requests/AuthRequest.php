<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Override;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ];
        
    }
    #[Override]
    public function messages()
    {
        return [
            'email.required'=>'l\'email est requi',
            'email.email'=>'Mauvais format du mail',
            'password.required'=>'Le mot de passe est requis',
            'password.min'=>'La taille minimale est de 6'
        ];
    }
}
