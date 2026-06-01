<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@yopmail.com',
            'password' => Hash::make('Admin1admin2')
        ]);
        $user->assignRole('Admin');
        $admin=Admin::create([
            'user_id'=>$user->id
        ]);
    }
}
