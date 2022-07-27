const mongoose = require('mongoose');

const argLength = process.argv.length;

if (argLength < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jdriegert:${password}@cluster0.o7tcykg.mongodb.net/phonenumberApp?retryWrites=true&w=majority
`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose
  .connect(url)
  .then(() => {
    if (argLength === 3) {
      console.log('phonebook:');
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(person);
        });
        return mongoose.connection.close();
      });
    } else {
      const argName = process.argv[3];
      const argNumber = argLength >= 5 ? process.argv[4] : '';

      const person = new Person({
        name: argName,
        number: argNumber,
      });

      person.save().then(() => {
        console.log('person saved!');
        mongoose.connection.close();
      });
    }
  })
  .catch((err) => console.log(err));
