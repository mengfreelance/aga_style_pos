<?php

namespace StylePOS\Controllers;

use StylePOS\Core\Controller;
use StylePOS\Models\Customer;

class CustomerController extends Controller
{
    public function index()
    {
        $this->requireAuth();
        $customerModel = new Customer($this->db);
        $this->json($customerModel->all());
    }

    public function search()
    {
        $this->requireAuth();
        $term = $this->getQuery('q', '');
        $customerModel = new Customer($this->db);
        $this->json($customerModel->search($term));
    }

    public function store()
    {
        $this->requireAuth();
        $input = $this->getInput();
        $this->requireFields($input, ['name', 'phone']);

        $customerModel = new Customer($this->db);
        $id = $customerModel->create([
            'name'   => $input['name'],
            'phone'  => $input['phone'],
            'email'  => $input['email'] ?? '',
            'address'=> $input['address'] ?? '',
        ]);
        $this->json(['id' => $id, 'message' => 'Customer created'], 201);
    }

    public function show(int $id)
    {
        $this->requireAuth();
        $customerModel = new Customer($this->db);
        $customer = $customerModel->find($id);
        if (!$customer) {
            $this->json(['error' => 'Customer not found'], 404);
        }
        $this->json($customer);
    }

    public function update(int $id)
    {
        $this->requireAuth();
        $input = $this->getInput();
        $customerModel = new Customer($this->db);
        $customerModel->update($id, [
            'name'   => $input['name'] ?? '',
            'phone'  => $input['phone'] ?? '',
            'email'  => $input['email'] ?? '',
            'address'=> $input['address'] ?? '',
        ]);
        $this->json(['message' => 'Customer updated']);
    }

    public function destroy(int $id)
    {
        $this->requireAuth();
        $customerModel = new Customer($this->db);
        $customerModel->delete($id);
        $this->json(['message' => 'Customer deleted']);
    }
}
