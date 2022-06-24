

import chai from 'chai';
import chaiHttp from 'chai-http';

// const user_routes = "https://cape-node-backend.herokuapp.com/api/users"
// const expense_category_routes = "https://cape-node-backend.herokuapp.com/api/expense_category"
// const income_category_routes = "https://cape-node-backend.herokuapp.com/api/income_category"

const user_routes = "http://localhost:5000/api/users"
const expense_category_routes = "http://localhost:5000/api/expense_category"
const income_category_routes = "http://localhost:5000/api/income_category"



chai.should();
chai.use(chaiHttp);

const user_id = "user_tester_001"
console.log("For test, user_id is: " + user_id)
let account_id;
let income_id;
let expense_id;
let plan_id;
let debt_id;
let income_category_id;
let expense_category_id;

// Test Accounts

// Account creation
describe('POST /api/users/:userId/accounts', () => {
    it('it should create a new account', (done) => {
        const account = {
            account_name: "Test Account",
            account_balance: 0,
            user_id: user_id
        }
        chai.request(user_routes)
            .post('/' + user_id + '/accounts')
            .send(account)
            .end((err, res) => {
                res.should.have.status(201);
                account_id = res.body.account_id;
                res.body.should.have.property('message').eql('Account created successfully');
                done(err);
            });
    });    
});
// Get list of accounts for user
describe('GET /api/users/:userId/accounts', () => {
    it('it should get all accounts for given user_id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/accounts')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get account by account id
describe('GET /api/users/:userId/accounts/:accountId', () => {
    it('it should get account by account id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/accounts/' + account_id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Edit account
describe('PUT /api/users/:userId/accounts/:accountId', () => {
    it('it should edit account by account id', (done) => {
        const account = {
            account_name: "Test Account",
            account_balance: 10000,
            user_id: user_id
        }
        chai.request(user_routes)
            .put('/' + user_id + '/accounts/' + account_id)
            .send(account)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Delete account
describe('DELETE /api/users/:userId/accounts/:accountId', () => {
    it('it should delete account by account id', (done) => {
        chai.request(user_routes)
            .delete('/' + user_id + '/accounts/' + account_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});

// Test Income Categories

// Income Category creation
describe('POST /api/income_category', () => {
    it('it should create a new income category', (done) => {
        const income_category = {
            category_name: "Test Income Category",
            category_details: "Test Income Category Details",
            category_icon: "Test Income Category Icon",
        }
        chai.request(income_category_routes)
            .post('/')
            .send(income_category)
            .end((err, res) => {
                res.should.have.status(200);
                income_category_id = res.body.income_category_id;
                res.body.should.have.property('message').eql('Income Category created successfully');
                done(err);
            });
    });
});

// Get list of income categories
describe('GET /api/income_category', () => {
    it('it should get all income categories', (done) => {
        chai.request(income_category_routes)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get income category by income category id
describe('GET /api/income_category/:incomeCategoryId', () => {
    it('it should get income category by income category id', (done) => {
        chai.request(income_category_routes)
            .get('/' + income_category_id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Edit income category
describe('PUT /api/income_category/:incomeCategoryId', () => {
    it('it should edit income category by income category id', (done) => {
        const income_category = {
            category_name: "Test Income Category",
            category_details: "Test Income Category Details",
            category_icon: "Test Income Category Icon",
        }
        chai.request(income_category_routes)
            .put('/' + income_category_id)
            .send(income_category)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Delete income category
describe('DELETE /api/income_category/:incomeCategoryId', () => {
    it('it should delete income category by income category id', (done) => {
        chai.request(income_category_routes)
            .delete('/' + income_category_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});


// Test Incomes

// Income creation
describe('POST /api/users/:userId/incomes', () => {
    it('it should create a new income', (done) => {
        const income = {
            income_title: "Test Income",
            income_amount: 100,
            income_details: "Test Income Details",
            income_date: "2020-01-01",
            ic_id: income_category_id,
            account_id: account_id,
            user_id: user_id
        }
        chai.request(user_routes)
            .post('/' + user_id + '/incomes')
            .send(income)
            .end((err, res) => {
                res.should.have.status(201);
                income_id = res.body.income_id;
                res.body.should.have.property('message').eql('Income created successfully');
                done(err);
            });
    });
});


// Get list of incomes for user
describe('GET /api/users/:userId/incomes', () => {
    it('it should get all incomes for given user_id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/incomes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get income by income id
describe('GET /api/users/:userId/incomes/:incomeId', () => {
    it('it should get income by income id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/incomes/' + income_id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});

// Edit income
describe('PUT /api/users/:userId/incomes/:incomeId', () => {
    it('it should edit income by income id', (done) => {
        const income = {
            income_title: "Test Income",
            income_amount: 100,
            income_details: "Test Income Details",
            income_date: "2020-01-01",
            ic_id: income_category_id,
            account_id: account_id,
            user_id: user_id
        }
        chai.request(user_routes)
            .put('/' + user_id + '/incomes/' + income_id)
            .send(income)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Delete income
describe('DELETE /api/users/:userId/incomes/:incomeId', () => {
    it('it should delete income by income id', (done) => {
        chai.request(user_routes)
            .delete('/' + user_id + '/incomes/' + income_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});


// Test Expense Categories

// Expense Category creation
describe('POST /api/expense_category', () => {
    it('it should create a new expense category', (done) => {
        const expense_category = {
            category_name: "Test Expense Category",
            category_details: "Test Expense Category Details",
            category_icon: "Test Expense Category Icon",
        }
        chai.request(expense_category_routes)
            .post('/')
            .send(expense_category)
            .end((err, res) => {
                res.should.have.status(200);
                expense_category_id = res.body.expense_category_id;
                res.body.should.have.property('message').eql('Expense Category created successfully');
                done(err);
            });
    });
});

// Get list of expense categories
describe('GET /api/expense_category', () => {
    it('it should get all expense categories', (done) => {
        chai.request(expense_category_routes)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get expense category by income category id
describe('GET /api/expense_category/:expenseCategoryId', () => {
    it('it should get expense category by expense category id', (done) => {
        chai.request(expense_category_routes)
            .get('/' + expense_category_id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Edit expense category
describe('PUT /api/expense_category/:expenseCategoryId', () => {
    it('it should edit expense category by expense category id', (done) => {
        const expense_category = {
            category_name: "Test Expense Category",
            category_details: "Test Expense Category Details",
            category_icon: "Test Expense Category Icon",
        }
        chai.request(expense_category_routes)
            .put('/' + expense_category_id)
            .send(expense_category)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Delete expense category
describe('DELETE /api/expense_category/:expenseCategoryId', () => {
    it('it should delete expense category by expense category id', (done) => {
        chai.request(expense_category_routes)
            .delete('/' + expense_category_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});


// Test Expenses

// Expense creation
describe('POST /api/users/:userId/expenses', () => {
    it('it should create a new expense', (done) => {
        const expense = {
            expense_title: "Test Expense",
            expense_amount: 100,
            expense_details: "Test Expense Details",
            expense_date: "2020-01-01",
            ec_id: expense_category_id,
            account_id: account_id,
            user_id: user_id
        }
        chai.request(user_routes)
            .post('/' + user_id + '/expenses')
            .send(expense)
            .end((err, res) => {
                res.should.have.status(201);
                expense_id = res.body.expense_id;
                res.body.should.have.property('message').eql('Expense created successfully');
                done(err);
            });
    });
});
// Get list of expenses for user
describe('GET /api/users/:userId/expenses', () => {
    it('it should get all expenses for given user_id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/expenses')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get expense by expense id
describe('GET /api/users/:userId/expenses/:expenseId', () => {
    it('it should get expense by expense id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/expenses/' + expense_id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Edit expense
describe('PUT /api/users/:userId/expenses/:expenseId', () => {
    it('it should edit expense by expense id', (done) => {
        const expense = {
            expense_title: "Test Expense",
            expense_amount: 100,
            expense_details: "Test Expense Details",
            expense_date: "2020-01-01",
            ec_id: expense_category_id,
            account_id: account_id,
            user_id: user_id
        }
        chai.request(user_routes)
            .put('/' + user_id + '/expenses/' + expense_id)
            .send(expense)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);  
            });
    });
});
// Delete expense
describe('DELETE /api/users/:userId/expenses/:expenseId', () => {
    it('it should delete expense by expense id', (done) => {
        chai.request(user_routes)
            .delete('/' + user_id + '/expenses/' + expense_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});



// Test Plans

// Plan creation
describe('POST /api/users/:userId/plans', () => {
    it('it should create a new plan', (done) => {
        const plan = {
            plan_title: "Test Plan",
            target_amount: 100,
            plan_details: "Test Plan Details",
            target_date: "2020-01-01",
            ic_id: income_category_id,
        }
        chai.request(user_routes)
            .post('/' + user_id + '/plans')
            .send(plan)
            .end((err, res) => {
                res.should.have.status(201);
                plan_id = res.body.plan_id;
                console.log(`Plan id: ${plan_id}`);
                res.body.should.have.property('message').eql('Plan created successfully');
                done(err);
            });
    });
});
// Get list of plans for user
describe('GET /api/users/:userId/plans', () => {
    it('it should get all plans for given user_id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/plans')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get plan by plan id
describe('GET /api/users/:userId/plans/:planId', () => {
    it('it should get plan by plan id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/plans/' + plan_id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Edit plan
describe('PUT /api/users/:userId/plans/:planId', () => {
    it('it should edit plan by plan id', (done) => {
        const plan = {
            plan_title: "Test Plan",
            target_amount: 100,
            plan_details: "Test Plan Details",
            target_date: "2020-01-01",
            ic_id: income_category_id,
            account_id: account_id,
            user_id: user_id
        }
        chai.request(user_routes)
            .put('/' + user_id + '/plans/' + plan_id)
            .send(plan)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});

// Delete plan
describe('DELETE /api/users/:userId/plans/:planId', () => {
    it('it should delete plan by plan id', (done) => {
        chai.request(user_routes)
            .delete('/' + user_id + '/plans/' + plan_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});


// Test Debts
// Debt creation
describe('POST /api/users/:userId/debts', () => {
    it('it should create a new debt', (done) => {
        const debt = {
            debt_title: "Test Debt",
            debt_amount: 100,
            debt_details: "Test Debt Details",
            due_date: "2020-01-01",
            ec_id: expense_category_id,
        }
        chai.request(user_routes)
            .post('/' + user_id + '/debts')
            .send(debt)
            .end((err, res) => {
                res.should.have.status(201);
                debt_id = res.body.debt_id;
                res.body.should.have.property('message').eql('Debt created successfully');
                done(err);
            });
    });
});

// Get list of debts for user
describe('GET /api/users/:userId/debts', () => {
    it('it should get all debts for given user_id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/debts')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done(err);
            });
    });
});
// Get debt by debt id
describe('GET /api/users/:userId/debts/:debtId', () => {
    it('it should get debt by debt id', (done) => {
        chai.request(user_routes)
            .get('/' + user_id + '/debts/' + debt_id)
            .end((err, res) => {    
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Edit debt
describe('PUT /api/users/:userId/debts/:debtId', () => {
    it('it should edit debt by debt id', (done) => {
        const debt = {
            debt_title: "Test Debt",
            debt_amount: 100,
            debt_details: "Test Debt Details",
            due_date: "2020-01-01",
            ec_id: expense_category_id,
        }
        chai.request(user_routes)
            .put('/' + user_id + '/debts/' + debt_id)
            .send(debt)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done(err);
            });
    });
});
// Delete debt
describe('DELETE /api/users/:userId/debts/:debtId', () => {
    it('it should delete debt by debt id', (done) => {
        chai.request(user_routes)
            .delete('/' + user_id + '/debts/' + debt_id)
            .end((err, res) => {
                res.should.have.status(200);
                done(err);
            });
    });
});
