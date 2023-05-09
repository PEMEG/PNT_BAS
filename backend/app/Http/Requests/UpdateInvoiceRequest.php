<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $method = $this->method();

        if ($method == 'PUT') {
            return [
                'month' => ['required'],
                'consumption' => ['required'],
                'cost' => ['required']
            ];
        } else {
            return [
                'month' => ['sometimes', 'required'],
                'consumption' => ['sometimes', 'required'],
                'cost' => ['sometimes', 'required']
            ];
        }
    }
}
