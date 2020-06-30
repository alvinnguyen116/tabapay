#Part 2:

## Question
What if the number of Child Nodes for any Parent can be very big, like thousands...

How would you do it differently?

Assume data is coming from the Backend Server... (AJAX Calls)

## Answer
Dealing with large amounts of data, a great way to save screen real-estate is to 
hide the data behind UI screens i.e. pagination or search bars. 

It is unnecessary to load any Child Nodes not currently in the user's view. We can 
implement infinite scrolling to load more data dynamically (think of the news feed from Facebook or Instagram).
We could also implement virtual scrolling to reduce the amount of elements in the DOM. 

Here is an [article](https://medium.com/@alvinnguyen116/virtual-and-infinite-scrolling-in-react-d56a05976cd2) 
I wrote explaining the difference (implemented in ReactJS).




