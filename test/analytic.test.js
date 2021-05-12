let chai = require('chai');
let controller = require('../service/functionRepo')
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

const mockData = [
    {"ip":"198.244.98.2","coordinates":{"x":145.53,"y":44.56}},
    {"ip":"198.244.108.2","coordinates":{"x":100.53,"y":-23.56}},
    {"ip":"198.244.98.2","coordinates":{"x":145.53,"y":44.56}},
]

describe('Analytics', () => {
    // test get all results
    beforeEach((done) => { //Before each test we empty the database
        controller.clearDatabase()
        controller.saveMockData(mockData)
        done()
    });

    
    describe('/GET analytics', () => {
        it('it should GET all analytics report', (done) => {
          chai.request(server)
              .get('/analytics')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
              });
        });
    });

    describe('/GET analytics with query parameters', () => {
        it('it should GET a single report', (done) => {
          chai.request(server)
              .get('/analytics?ip=198.244.98.2')
              .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST analytics', () => {
        it('it should save analytics', (done) => {
            let event = { 
                ip: "198.244.98.1", 
                coordinates: { x: 1, y: 1 }
            }
        chai.request(server)
            .post('/analytics')
            .send(event)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql('success');
                done();
            });
        });

    });
})