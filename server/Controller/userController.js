require('dotenv').config();
// ==============Models require======**
const Register = require("../src/model/user");
const subscribeModel = require("../src/model/subscribeModel");
const NewsModel = require('../src/model/new');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cookie = require('cookie');


const register = async (req, res) => {
  try {

    const { email, firstname, lastname, phone, password, confirmpassword, address, language } = req.body;
    const image = req.file;
    if (!email || !firstname || !password || !confirmpassword) {
      return res.status(400).json({ alertMsg: "Please fill in all required fields." });
    }
    if (password !== confirmpassword) {
      return res.status(401).json({ alertMsg: "Passwords do not match." });
    }
    const existingUser = await Register.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
        { firstname: { $regex: new RegExp(`^${firstname}$`, 'i') } }
      ]
    });
    if (existingUser) {
      const existingField = existingUser.email === email ? "Email" : "Firstname";
      return res.status(500).json({ alertMsg: `${existingField} already exists. Please choose a different one.` });
    };
    const registerEmployee = new Register({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      password: password,
      confirmpassword: confirmpassword,
      image: image ? `images/${image.filename}` : '',
      language: language,
      address: address,
    })
    const registered = await registerEmployee.save();

    return res.status(201).json({ alertMsg: "successful registration" });

  } catch (error) {
    res.status(404).json({ alertMsg: `data not inserted!` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(201).json({ errorMsg: "All field are required" });
  }

  try {
    const User = await Register.findOne({ email });
    if (!User) {
      return res.status(201).json({ errorMsg: "User Not Found" });
    }
    const validPassword = await bcrypt.compare(password, User.password);
    if (!validPassword) {
      return res.status(201).json({ errorMsg: "Invalid Password" });
    }
    const token = jwt.sign(
      { id: User._id },
      process.env.SECRET_KEY
    );

    const { password: pass, ...rest } = User._doc;

    const expirationDate = new Date(Date.now() + 600000);

    res
      .status(201)
      .cookie("access_token", token, {
        secure: true,
        httpOnly: true,
        sameSite: 'None',
        expires: expirationDate
      })
      .json({ rest, errorMsg: "Go To Profile Page" });
  } catch (error) {
    return res.status(201).json({ errorMsg: "error to send login details" });
  }
};

const NewsApi = async (req, res) => {
  try {
    if (req.user.id) {
      const user = await Register.findById(req.user.id);
      res.json({ user: user });
    }
    else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

let updatedUser;

const Profile = async (req, res) => {
  try {
    if (req.user.id) {
      let updateUser;
      const user = await Register.findById(req.user.id);
      if (updatedUser) {
        if ((updatedUser._id).toString() === user._id) {
          updateUser = updatedUser;
        }
        else {
          updateUser = user;
        }
      }
      else {
        updateUser = user;
      }
      var users = await Register.find({ email: { $nin: [user.email] } });
      res.json({ user: updateUser, users: users });
    }
    else {
      return res.status(404).json({ error: 'User not found' });
    }
    // try 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUserProfileImage = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const relativeImagePath = imagePath.replace(/^.*[\\\/]/, 'images/');
    const _id = req.body._id;
    // console.log(relativeImagePath);
    // console.log(_id);

    await Register.findOneAndUpdate(
      { _id: _id },
      { $set: { image: relativeImagePath } },
      { new: true }
    );
    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      // if(req.UserForImage.id){
      var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: updatedUser, users: users });
      // }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateProfileNames = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const relativeImagePath = imagePath.replace(/^.*[\\\/]/, 'images/');
    const _id = req.body._id;
    let updated_user_firstname = req.body.firstname;
    let updated_user_lastname = req.body.lastname;
    let updated_user_Address = req.body.address;
    let updated_user_languages = req.body.language;
    const existingUser = await Register.findOne({
      firstname: { $regex: new RegExp(`^${updated_user_firstname}$`, 'i') },
      _id: { $ne: _id }, // Exclude the current user from the search
    });

    if (existingUser) {
      return res.status(400).json({ error: 'First name already exists' });
    }

    const ifDataNotFounded = await Register.findOne({ _id: _id });
    if (updated_user_firstname === '') {
      updated_user_firstname = ifDataNotFounded.firstname;
    }
    if (updated_user_lastname === '') {
      updated_user_lastname = ifDataNotFounded.lastname;
    }
    if (updated_user_Address === '') {
      updated_user_Address = ifDataNotFounded.address;
    }
    if (updated_user_languages === '') {
      updated_user_languages = ifDataNotFounded.language;
    };

    await Register.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          image: relativeImagePath,
          firstname: updated_user_firstname,
          lastname: updated_user_lastname,
          address: updated_user_Address,
          language: updated_user_languages,
        }
      },
      { new: true }
    );

    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: updatedUser, users: users, error: 'upload successfully' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateProfileOtherUsers = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const relativeImagePath = imagePath.replace(/^.*[\\\/]/, 'images/');
    const _id = req.body._id;
    const Make_Admin_id = req.body.Make_Admin_id;
    let updated_user_firstname = req.body.firstname;
    let updated_user_lastname = req.body.lastname;
    let updated_user_Address = req.body.address;
    let updated_user_languages = req.body.language;
    let updated_user_admin = req.body.admin;
    let updated_user_phone = req.body.phone;
    const existingUser = await Register.findOne({
      firstname: { $regex: new RegExp(`^${updated_user_firstname}$`, 'i') },
      _id: { $ne: Make_Admin_id }, // Exclude the current user from the search
    });

    if (existingUser) {
      return res.status(400).json({ error: 'First name already exists' });
    }

    const existingUserPhoneNo = await Register.findOne({
      phone: updated_user_phone,
      _id: { $ne: Make_Admin_id }, // Exclude the current user from the search
    });

    if (existingUserPhoneNo) {
      return res.status(400).json({ error: 'Phone Number already exists' });
    }

    const ifDataNotFounded = await Register.findOne({ _id: Make_Admin_id });
    if (updated_user_firstname === '') {
      updated_user_firstname = ifDataNotFounded.firstname;
    }
    if (updated_user_lastname === '') {
      updated_user_lastname = ifDataNotFounded.lastname;
    }
    if (updated_user_Address === '') {
      updated_user_Address = ifDataNotFounded.address;
    }
    if (updated_user_languages === '') {
      updated_user_languages = ifDataNotFounded.language;
    };

    const upadeUserSend = await Register.findOneAndUpdate(
      { _id: Make_Admin_id },
      {
        $set: {
          image: relativeImagePath,
          firstname: updated_user_firstname,
          lastname: updated_user_lastname,
          address: updated_user_Address,
          language: updated_user_languages,
          admin: updated_user_admin,
          phone: updated_user_phone,
        }
      },
      { new: true }
    );

    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      // var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: upadeUserSend, error: 'upload successfully' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const DeleteProfileOtherUsers = async (req, res) => {
  try {
    const _id = req.body._id;
    const DeleteUser_id = req.body.DeleteUser_id;
    const existingUser = await Register.findOne({ _id: DeleteUser_id });

    if (!existingUser) {
      return res.status(400).json({ error: 'already Deleted' });
    }

    await Register.deleteOne({ _id: DeleteUser_id });

    updatedUser = await Register.findOne({ _id: _id });

    if (updatedUser) {
      var users = await Register.find({ _id: { $nin: [_id] } });
      res.status(200).json({ user: updatedUser, users: users, error: 'Deleted successfully' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};



const logOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.json({ error: 'Successfully logOut' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const PostNewsApistore = async (req, res) => {
  try {
    const userID = req.body._id
    const User = await Register.findById(userID);
    const articles = [
      {
        source: {
          source_id: req.body.source_id,
          source_name: req.body.source_name,
        }
      },
      { author: req.body.author },
      { title: req.body.title },
      { description: req.body.description },
      { url: req.body.url },
      { urlToImage: req.body.urlToImage },
      { publishedAt: req.body.publishedAt },
      { content: req.body.content }
    ]
    if (User) {
      const NewsModel_save = new NewsModel({
        userEmailId: User.email,
        userImgage: User.image,
        address: User.address,
        articles: articles
      });

      await NewsModel_save.save();

      res.status(200).json({ message: 'Data stored successfully' });
    } else {
      res.status(404).json({ message: 'User Not Exist' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to store Data' });
  }

};

const ShowStoredData = async (req, res) => {
    const { pageAllData = 1} = req.query;
    const pageSize = 50
    const skip = (pageAllData - 1) * pageSize;
  
    const projectStage = {
      $project: {
        articles: {
          $filter: {
            input: '$articles',
            as: 'article',
            cond: {
              $and: [
                { $gte: ['$$article.publishedAt', new Date('2024-01-01T00:00:00.000Z')] }
              ]
            }
          }
        }
      }
    };
  
    const pipeline = [
      projectStage,
      { $unwind: '$articles' },
      { $replaceRoot: { newRoot: '$articles' } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(pageSize) }
    ];
  
    const pipelinecount = [
      projectStage,
      { $unwind: '$articles' },
      { $replaceRoot: { newRoot: '$articles' } },
      { $count: 'total' }
    ];
  
    try {
      const articles = await NewsModel.aggregate(pipeline);
      const articlesCount = await NewsModel.aggregate(pipelinecount);
      // console.log(articles)
  
      if (articlesCount && articlesCount[0] && articlesCount[0].total > 0) {
        res.json({ news: articles, totalResults: articlesCount[0].total });
      } else {
        res.status(429).json({ error: "Data Not Matched" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  
};

const NewsapiDatasend = async (req, res) => {
  try {
    const { news } = req.body;

    const articles = news.map((article) => {
      return {
        ...article,
      };
    });
    SearchBoxData = {
      q: articles[0].SearchBox.q,
      from: articles[0].SearchBox.from,
      to: articles[0].SearchBox.to,
      sortBy: articles[0].SearchBox.sortBy,
      country: articles[0].SearchBox.country,
      category: articles[0].SearchBox.category,
      sources: articles[0].SearchBox.sources,
      domains: articles[0].SearchBox.domains
    }
    if (!articles[0].SearchBox.sortBy) { SearchBoxData.sortBy = '' }
    if (!articles[0].SearchBox.country) { SearchBoxData.country = '' }
    if (!articles[0].SearchBox.category) { SearchBoxData.category = '' }
    if (!articles[0].SearchBox.sources) { SearchBoxData.sources = '' }
    if (!articles[0].SearchBox.domains) { SearchBoxData.domains = '' }

    // console.log(SearchBoxData)
    const InsertNews = {
      userEmailId: 'Not',
      userImgage: 'Not',
      address: 'Not',
      articles: articles,
      SearchBox: SearchBoxData
    };

    await NewsModel.insertMany(InsertNews);
    res.status(201).json({ message: 'Stored successfully' });

  } catch (error) {
    console.error('Error to Store the Data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const NewsapiDataGet = async (req, res) => {
  const { page = 1, pageSize = 50, q, from, to, sortBy, country, category, sources, domains } = req.query;
  const skip = (page - 1) * pageSize;

  const matchStage = {};
  if (q) {
    matchStage['SearchBox.q'] = { $regex: q.split(' ').join('|'), $options: 'i' };
    // Use $regex with '|' to match any part of 'q' in 'SearchBox.q'
  }
  if (domains) {
    matchStage['SearchBox.domains'] = { $regex: domains, $options: 'i' };
  }
  if (sortBy) {
    matchStage['SearchBox.sortBy'] = { $regex: sortBy, $options: 'i' };
  }
  if (country) {
    matchStage['SearchBox.country'] = { $regex: country, $options: 'i' };
  }
  if (category) {
    matchStage['SearchBox.category'] = { $regex: category, $options: 'i' };
  }
  if (sources) {
    matchStage['SearchBox.sources'] = { $regex: sources, $options: 'i' };
  }

  const projectStage = {
    $project: {
      articles: {
        $filter: {
          input: '$articles',
          as: 'article',
          cond: {
            $and: [
              { $gte: ['$$article.publishedAt', new Date(from)] },
              { $lte: ['$$article.publishedAt', new Date(to)] }
            ]
          }
        }
      },
      SearchBox: {
        $filter: {
          input: '$SearchBox',
          as: 'item',
          cond: {
            $regexMatch: { input: '$$item.q', regex: new RegExp(q, 'i') }
          }
        }
      }
    }
  };

  const pipeline = [
    { $match: matchStage },
    projectStage,
    { $unwind: '$articles' },
    { $replaceRoot: { newRoot: '$articles' } },
    { $skip: parseInt(skip) },
    { $limit: parseInt(pageSize) }
  ];

  const pipelinecount = [
    { $match: matchStage },
    projectStage,
    { $unwind: '$articles' },
    { $replaceRoot: { newRoot: '$articles' } },
    { $count: 'total' }
  ];

  try {
    const articles = await NewsModel.aggregate(pipeline);
    const articlesCount = await NewsModel.aggregate(pipelinecount);

    if (articlesCount && articlesCount[0] && articlesCount[0].total > 0) {
      res.json({ news: articles, totalResults: articlesCount[0].total });
    } else {
      res.status(429).json({ error: "Data Not Matched" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const subscribe = async (req, res) => {
  try {

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ alertMsg: "Enter Your Email to subscribe" });
    }
    const existingUser = await subscribeModel.findOne({ email: email });
    if (existingUser) {
      return res.status(500).json({ email: email, alertMsg: `already subscribed.` });
    }

    const subscribeMod = new subscribeModel({
      email: email
    });

    await subscribeMod.save();
    return res.status(201).json({ alertMsg: "Successfully subscribe." });


  } catch (error) {
    res.status(404).json({ alertMsg: `data not inserted!` });
  }
}

const SearchData = async (req, res) => {
  const { searchPage = 1, searchQuery } = req.query;
  const searchTerm = String(searchQuery || '');
  const pageSize = 20;
  const skip = (searchPage - 1) * pageSize;

  let regexPattern = ''; // Define regexPattern variable here

  if (searchTerm) {
    // Split the search query into individual words and create a regex pattern
    const searchWords = searchTerm.split(' ').filter(Boolean);
    regexPattern = searchWords.map(word => `(?=.*${word})`).join('');
  }
  // console.log(regexPattern)

  const matchStage = {};
  if (searchTerm) {
    // matchStage['SearchBox.q'] = { $regex: new RegExp(regexPattern, 'i') };
    matchStage['SearchBox.q'] = { $regex: regexPattern.split(' ').join('|'), $options: 'i' };
    // Use $regex with '|' to match any part of 'q' in 'SearchBox.q'
  }

  const projectStage = {
    $project: {
      articles: {
        $filter: {
          input: '$articles',
          as: 'article',
          cond: {
            $and: [
              { $gte: ['$$article.publishedAt', new Date('1924-01-01T00:00:00.000Z')] }
            ]
          }
        }
      },
      SearchBox: {
        $filter: {
          input: '$SearchBox',
          as: 'item',
          cond: {
            $regexMatch: { input: '$$item.q', regex: new RegExp(regexPattern, 'i') }
          }
        }
      }
    }
  };

  const pipeline = [
    projectStage,
    { $match: matchStage },
    { $unwind: '$articles' },
    { $replaceRoot: { newRoot: '$articles' } },
    { $skip: parseInt(skip) },
    { $limit: parseInt(pageSize) }
  ];

  const pipelinecount = [
    projectStage,
    { $match: matchStage },
    { $unwind: '$articles' },
    { $replaceRoot: { newRoot: '$articles' } },
    { $count: 'total' }
  ];

  try {
    const articles = await NewsModel.aggregate(pipeline);
    const articlesCount = await NewsModel.aggregate(pipelinecount);
    console.log(searchPage,":",articles.length,articlesCount[0].total)

    if (articlesCount && articlesCount[0] && articlesCount[0].total > 0) {
      res.json({ news: articles, totalResults: articlesCount[0].total });
    } else {
      res.status(429).json({ error: "Data Not Matched" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  register,
  login,
  logOut,
  NewsApi,
  Profile,
  updateUserProfileImage,
  updateProfileNames,
  updateProfileOtherUsers,
  DeleteProfileOtherUsers,
  NewsapiDatasend,
  NewsapiDataGet,
  PostNewsApistore,
  ShowStoredData,
  subscribe,
  SearchData
}