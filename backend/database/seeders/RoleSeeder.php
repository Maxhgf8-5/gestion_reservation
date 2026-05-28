<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 0. Vider le cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Créer les permissions AVEC guard_name 'api'
        Permission::create(['name' => 'manage dashboard',          'guard_name' => 'api']);
        Permission::create(['name' => 'manage lecteur',            'guard_name' => 'api']);
        Permission::create(['name' => 'manage livre',              'guard_name' => 'api']);
        Permission::create(['name' => 'manage reservation',        'guard_name' => 'api']);
        Permission::create(['name' => 'manage reservationLecteur', 'guard_name' => 'api']);
        Permission::create(['name' => 'manage admin', 'guard_name' => 'api']); 

        // 2. Créer les rôles
        $admin = Role::create(['name' => 'Admin',   'guard_name' => 'api']);
        $lecteur = Role::create(['name' => 'Lecteur', 'guard_name' => 'api']);

        // 3. Assigner les permissions aux rôles
        $admin->givePermissionTo([
            'manage dashboard',
            'manage lecteur',
            'manage livre',
            'manage reservation',
            'manage admin', 
        ]);

            
        $lecteur->givePermissionTo(['manage dashboard','manage reservationLecteur']);
    }
}
