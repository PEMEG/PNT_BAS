<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeterReadingRequest extends FormRequest
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
                'state' => ['required'],
                'month' => ['required'],
                // 'month' => ['required', 'date_format:m/Y'],
                'room_id' => ['required']
            ];
        } else {
            return [
                'state' => ['sometimes', 'required'],
                'month' => ['sometimes', 'required'],
                'room_id' => ['sometimes', 'required']
            ];
        }
    }
}
