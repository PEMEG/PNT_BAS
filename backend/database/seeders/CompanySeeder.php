<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            'name' => 'PNT'
        ]);
        Company::create([
            'name' => 'Bluesoft'
        ]);
        Company::create([
            'name' => 'Z-Technology'
        ]);
        Company::create([
            'name' => 'CyberEva'
        ]);
    }
}
