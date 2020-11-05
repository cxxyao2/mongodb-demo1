// 400 bad request, e.g. grammatical error
// 401 unauthorized
// 403 forbidden, 
// 404 not found
// 200 ok , get or post

// POST /api/returns {customerId, movieId}
// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 401 if no rental found for this customer/move
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental
const moment = require('moment');
const request = require('supertest');
const {Rental } = require('../../models/rental');
const {User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/rentals', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async() => {
    server = require('../../index');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    
    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });


  afterEach(async() => { 
    await server.close();
    await Rental.remove({});
  });

  it('should work!', async() => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  it('should return 401 if client is not logged in!', async() => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);

  });

  it('should return 400 if customerId is null!', async() => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is null!', async() => {
    movieId = '';

    const res = await exec();
    expect(res.status).toBe(400);

  });

  it('should return 404 if rental not found!', async() => {
    await Rental.remove({});

    const res = await exec();
    expect(res.status).toBe(404);
    
  });

  it('should return 400 if rental already processed!', async() => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
    
  });


  it('should return 200 if all is ok!', async() => {
 
    const res = await exec();

    expect(res.status).toBe(200);
    
  });

  it('should set the returnDate if input is valid', async() => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
     expect(rentalInDb.rentalFee).toBeDefined();
  
    // expect(diff).toBeLessThan(10*1000);

  });



});
