import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Image,
  Bold,
  Italic,
  Link as LinkIcon,
  Send,
  Heart,
  Share2,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

const Community = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    image: null,
  });
  const createPostRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Load existing posts from localStorage or set default posts
    const savedPosts = localStorage.getItem("communityPosts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Set default posts
      const defaultPosts = [
        {
          id: 1,
          author: "Priya Patel",
          avatar:
            "https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg",
          title: "Tips for first-time dog owners in Rajkot?",
          content:
            "I just adopted my first dog and would love some advice from experienced pet parents in our community. What are the essential things I should know?",
          category: "General Discussion",
          replies: 12,
          likes: 24,
          timeAgo: "2 hours ago",
          image: null,
        },
        {
          id: 2,
          author: "Arjun Shah",
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
          title: "My rescue cat Whiskers found her forever home! 🎉",
          content:
            "After 3 months of fostering, Whiskers has been adopted by the most wonderful family. Seeing her happy and settled brings so much joy to my heart!",
          category: "Success Stories",
          replies: 8,
          likes: 45,
          timeAgo: "4 hours ago",
          image:
            "https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg",
        },
        {
          id: 3,
          author: "Meera Joshi",
          avatar:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
          title: "Looking for advice on fostering puppies",
          content:
            "I'm considering becoming a foster parent for puppies. What should I expect and how can I prepare my home for these little ones?",
          category: "Foster Parents",
          replies: 15,
          likes: 18,
          timeAgo: "6 hours ago",
          image: null,
        },
      ];
      setPosts(defaultPosts);
      localStorage.setItem("communityPosts", JSON.stringify(defaultPosts));
    }
  }, []);

  const forumCategories = [
    {
      icon: MessageCircle,
      title: "General Discussion",
      description: "Share experiences and connect with other pet parents",
      posts: 342,
      lastActivity: "2 minutes ago",
    },
    {
      icon: Award,
      title: "Success Stories",
      description: "Celebrate adoption and foster success stories",
      posts: 128,
      lastActivity: "1 hour ago",
    },
    {
      icon: Users,
      title: "Foster Parents",
      description: "Support and advice for foster families",
      posts: 89,
      lastActivity: "3 hours ago",
    },
    {
      icon: TrendingUp,
      title: "Training Tips",
      description: "Pet training advice and behavioral guidance",
      posts: 156,
      lastActivity: "30 minutes ago",
    },
  ];

  const upcomingEvents = [
    {
      date: "15",
      month: "Dec",
      title: "Pet Adoption Drive",
      location: "Rajkot Municipal Garden",
      time: "10:00 AM - 4:00 PM",
      attendees: 45,
    },
    {
      date: "22",
      month: "Dec",
      title: "Foster Family Meet & Greet",
      location: "Community Center, University Road",
      time: "5:00 PM - 7:00 PM",
      attendees: 23,
    },
    {
      date: "28",
      month: "Dec",
      title: "Pet Care Workshop",
      location: "Online Event",
      time: "7:00 PM - 8:30 PM",
      attendees: 67,
    },
  ];

  const handleCreatePost = () => {
    if (!currentUser) {
      window.location.href = "/auth";
      return;
    }
    setShowCreatePost(true);

    // Scroll to create post section after a brief delay to ensure the section is rendered
    setTimeout(() => {
      createPostRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return;
    }

    const post = {
      id: Date.now(),
      author: currentUser.name,
      avatar:
        "https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg",
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      replies: 0,
      likes: 0,
      timeAgo: "Just now",
      image: newPost.image,
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));

    // Reset form
    setNewPost({
      title: "",
      content: "",
      category: "general",
      image: null,
    });
    setShowCreatePost(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost({ ...newPost, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post,
    );
    setPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));
  };

  const handleEventRegistration = (eventTitle) => {
    if (!currentUser) {
      toast.error("Please sign in to register for events");
      window.location.href = "/auth";
      return;
    }

    // Find the event and navigate to registration page
    const event = upcomingEvents.find((e) => e.title === eventTitle);
    if (event) {
      // Create a simple event ID from title
      const eventId = eventTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      window.location.href = `/event-registration/${eventId}`;
    }
  };

  const formatText = (type) => {
    const textarea = document.getElementById("post-content");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = "";
    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    setNewPost({ ...newPost, content: newContent });
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-secondary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
              Join Our Pet-Loving Community
            </h1>
            <p className="text-xl text-accent-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with fellow pet lovers, share experiences, get advice, and
              stay updated on events in Rajkot's most caring pet community.
            </p>
            {currentUser && (
              <div className="mb-6 inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full">
                <span className="font-medium">
                  Welcome back, {currentUser.name}! You're part of our{" "}
                  {currentUser.userType} community.
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCreatePost}
                className="bg-white text-accent-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                {currentUser ? "Create New Post" : "Sign In to Post"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-bold text-3xl text-secondary-500 mb-2">
                1,247
              </div>
              <div className="text-primary-600">Community Members</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-accent-500 mb-2">
                {posts.length + 2156}
              </div>
              <div className="text-primary-600">Forum Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-green-500 mb-2">89</div>
              <div className="text-primary-600">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-purple-500 mb-2">24</div>
              <div className="text-primary-600">Monthly Events</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create Post Section */}
            {showCreatePost && currentUser && (
              <div
                ref={createPostRef}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                  Create New Post
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Post Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="Enter your post title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) =>
                        setNewPost({ ...newPost, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    >
                      <option value="general">General Discussion</option>
                      <option value="success">Success Stories</option>
                      <option value="foster">Foster Parents</option>
                      <option value="training">Training Tips</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Content
                    </label>
                    <div className="border border-primary-200 rounded-lg">
                      <div className="flex items-center space-x-2 p-3 border-b border-primary-200 bg-primary-50">
                        <button
                          onClick={() => formatText("bold")}
                          className="p-2 hover:bg-primary-200 rounded"
                          title="Bold"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => formatText("italic")}
                          className="p-2 hover:bg-primary-200 rounded"
                          title="Italic"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <label
                          className="p-2 hover:bg-primary-200 rounded cursor-pointer"
                          title="Add Image"
                        >
                          <Image className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <textarea
                        id="post-content"
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost({ ...newPost, content: e.target.value })
                        }
                        rows={6}
                        className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"
                        placeholder="Share your thoughts, experiences, or questions..."
                      />
                    </div>
                  </div>

                  {newPost.image && (
                    <div className="relative">
                      <img
                        src={newPost.image}
                        alt="Upload preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setNewPost({ ...newPost, image: null })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmitPost}
                      className="bg-secondary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200 flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish Post
                    </button>
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="bg-primary-200 text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-300 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forum Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                Discussion Forums
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {forumCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={index}
                      className="border border-primary-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-secondary-300"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-secondary-100 p-2 rounded-lg">
                          <IconComponent className="h-5 w-5 text-secondary-500" />
                        </div>
                        <h3 className="font-semibold text-primary-800">
                          {category.title}
                        </h3>
                      </div>
                      <p className="text-primary-600 text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-primary-500">
                        <span>{category.posts} posts</span>
                        <span>{category.lastActivity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                Recent Discussions
              </h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-primary-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-800 text-lg mb-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-4 mb-3 text-sm text-primary-500">
                          <span>by {post.author}</span>
                          <span>in {post.category}</span>
                          <span>{post.timeAgo}</span>
                        </div>
                        <p className="text-primary-600 mb-4 leading-relaxed">
                          {post.content}
                        </p>

                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post image"
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}

                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center space-x-2 text-primary-600 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-primary-600 hover:text-blue-500 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.replies} replies</span>
                          </button>
                          <button className="flex items-center space-x-2 text-primary-600 hover:text-green-500 transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="border border-primary-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-center">
                        <div className="font-bold text-2xl text-secondary-500">
                          {event.date}
                        </div>
                        <div className="text-sm text-primary-600 uppercase">
                          {event.month}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-800 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-primary-600 mb-2">
                          {event.location}
                        </p>
                        <div className="flex items-center justify-between text-xs text-primary-500 mb-3">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.attendees} attending
                          </span>
                        </div>
                        <button
                          onClick={() => handleEventRegistration(event.title)}
                          className="w-full bg-accent-500 text-white font-semibold py-3 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {currentUser
                            ? "Register for Event"
                            : "Sign In to Register"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
                Community Guidelines
              </h2>
              <ul className="space-y-2 text-sm text-primary-600">
                <li>• Be respectful and kind to all members</li>
                <li>• Share accurate information about pet care</li>
                <li>• No commercial promotions without approval</li>
                <li>• Keep discussions relevant to pets and animal welfare</li>
                <li>• Report inappropriate content to moderators</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl p-6 text-white">
              <h2 className="font-heading font-bold text-xl mb-4">
                {currentUser
                  ? `Welcome ${currentUser.name}!`
                  : "New to the Community?"}
              </h2>
              <p className="text-secondary-100 mb-4 text-sm">
                {currentUser
                  ? `As a ${currentUser.userType}, you can participate in all community features and discussions.`
                  : "Introduce yourself and let us know about your pets or interest in animal welfare!"}
              </p>
              <button
                onClick={handleCreatePost}
                className="w-full bg-white text-secondary-600 font-semibold py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                {currentUser ? "Create a Post" : "Sign In to Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
