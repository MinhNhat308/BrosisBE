// Test script để kiểm tra API
const testAPI = async () => {
  const baseURL = 'http://localhost:3000/blog';
  
  console.log('🧪 Testing Blog API...\n');
  
  try {
    // Test 1: GET all blogs
    console.log('1. Testing GET /blog (get all blogs)');
    const response1 = await fetch(baseURL);
    const blogs = await response1.json();
    console.log('✅ Status:', response1.status);
    console.log('📊 Response:', blogs);
    console.log('');
    
    // Test 2: POST create new blog
    console.log('2. Testing POST /blog (create new blog)');
    const newBlog = {
      title: 'Test Blog Title',
      content: 'This is a test blog content. Lorem ipsum dolor sit amet.',
      author: 'Test Author'
    };
    
    const response2 = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBlog)
    });
    
    if (response2.ok) {
      const createdBlog = await response2.json();
      console.log('✅ Status:', response2.status);
      console.log('📝 Created blog:', createdBlog);
      
      // Test 3: GET blog by ID
      if (createdBlog.id) {
        console.log('\n3. Testing GET /blog/:id (get blog by ID)');
        const response3 = await fetch(`${baseURL}/${createdBlog.id}`);
        const blog = await response3.json();
        console.log('✅ Status:', response3.status);
        console.log('📖 Blog details:', blog);
        
        // Test 4: PUT update blog
        console.log('\n4. Testing PUT /blog/:id (update blog)');
        const updatedData = {
          title: 'Updated Test Blog Title',
          content: 'This is updated content for the test blog.',
          author: 'Updated Author'
        };
        
        const response4 = await fetch(`${baseURL}/${createdBlog.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData)
        });
        
        const updatedBlog = await response4.json();
        console.log('✅ Status:', response4.status);
        console.log('✏️ Updated blog:', updatedBlog);
        
        // Test 5: DELETE blog
        console.log('\n5. Testing DELETE /blog/:id (delete blog)');
        const response5 = await fetch(`${baseURL}/${createdBlog.id}`, {
          method: 'DELETE'
        });
        
        const deleteResult = await response5.json();
        console.log('✅ Status:', response5.status);
        console.log('🗑️ Delete result:', deleteResult);
      }
    } else {
      const error = await response2.json();
      console.log('❌ Status:', response2.status);
      console.log('💥 Error:', error);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n🎉 Testing completed!');
};

// Chạy test
testAPI();
