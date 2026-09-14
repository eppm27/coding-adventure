// Each authored row is [scenario, question, correct answer, three distractors, explanation].
// Expanded below into one consistent, validated public question schema.
const bank = {
  'front-end': {
    beginner: [
      ['Introduce the club.', 'Which HTML element represents the main heading?', '<h1>', '<p>', '<footer>', '<img>', 'An h1 identifies the main heading of a page. CSS controls its visual size.'],
      ['Give the site a style.', 'Which language controls colors and spacing on a web page?', 'CSS', 'SQL', 'JSON', 'HTML', 'CSS describes presentation, including colors, spacing, and layout.'],
      ['Make the menu respond.', 'Which language commonly handles button clicks in the browser?', 'JavaScript', 'SQL', 'Markdown', 'CSS', 'JavaScript responds to events and updates a page.'],
      ['Connect the pages.', 'Which HTML element creates a link to another page?', '<a>', '<section>', '<strong>', '<title>', 'An anchor with an href points to a page or another destination.'],
      ['Add a club photo.', 'What should alt text describe for an informative photo?', 'The information the photo conveys', 'The image file size', 'Every color in the image', 'The web address only', 'Useful alternative text conveys the image’s purpose to people who cannot see it.'],
      ['Collect a first name.', 'Which element gives a text input an accessible name?', '<label>', '<hr>', '<br>', '<ul>', 'A label associated with an input tells people what to enter.'],
      ['List upcoming events.', 'Which HTML element contains an unordered list?', '<ul>', '<h2>', '<form>', '<span>', 'A ul contains list items where the order is not significant.'],
      ['Create a clear action.', 'Which element should submit an action without navigating away?', '<button>', '<div>', '<em>', '<img>', 'A native button supports keyboard interaction and exposes its role automatically.']
    ],
    intermediate: [
      ['Arrange the navigation.', 'Which CSS layout is designed for arranging items along a row or column?', 'Flexbox', 'SQL JOIN', 'JSON', 'HTTP', 'Flexbox distributes and aligns items along one main axis.'],
      ['Adapt the page to phones.', 'Which CSS feature applies styles at different viewport widths?', 'Media queries', 'HTML comments', 'Database indexes', 'API keys', 'Media queries can conditionally apply styles based on viewport width.'],
      ['Find the signup button.', 'What does document.querySelector("#join") return?', 'The first element with id join, or null', 'Every button on the page', 'A new HTML file', 'Only the element’s text', 'querySelector returns the first matching element, or null if none exists.'],
      ['Handle a click.', 'Which method attaches a handler to a button without replacing existing handlers?', 'addEventListener()', 'JSON.parse()', 'Array.join()', 'Math.round()', 'addEventListener registers a function to run when an event occurs.'],
      ['Make images flexible.', 'Which rule keeps an image from exceeding its container’s width?', 'max-width: 100%', 'width: 2000px', 'position: fixed', 'overflow: visible', 'max-width: 100% caps the image width at the available container width.'],
      ['Help keyboard users.', 'What should happen when a button receives keyboard focus?', 'A visible focus indicator appears', 'Its text disappears', 'It moves away', 'The page reloads', 'Visible focus lets keyboard users know which control will activate.'],
      ['Show a visitor’s name.', 'Which property inserts plain text without interpreting it as HTML?', 'textContent', 'innerHTML', 'outerHTML', 'src', 'textContent treats the value as text, including any angle brackets.'],
      ['Keep cards consistent.', 'With box-sizing: border-box, what does the declared width include?', 'Content, padding, and border', 'Only the content', 'All external margins', 'The entire viewport', 'border-box includes padding and borders in an element’s declared width.']
    ],
    advanced: [
      ['Repair a popup.', 'Where should keyboard focus move when a modal opens?', 'Into the modal', 'To the browser address bar', 'Behind the modal', 'Nowhere; hide it', 'Moving focus into a modal lets keyboard users interact with its contents.'],
      ['Respect motion preferences.', 'Which media query detects a request for less animation?', 'prefers-reduced-motion: reduce', 'prefers-color-scheme: dark', 'min-width: 1px', 'orientation: portrait', 'prefers-reduced-motion lets a page reduce nonessential movement.'],
      ['Update a dynamic event list.', 'What is event delegation?', 'Handling child events on a shared ancestor', 'Reloading for every click', 'Disabling all child elements', 'Copying every event handler', 'Many events bubble to ancestors, so one handler can respond to multiple children.'],
      ['Read upcoming events.', 'What does await do inside an async function?', 'Waits for a promise to settle before continuing that function', 'Freezes all browser input', 'Converts HTML to CSS', 'Repeats the function forever', 'await pauses that async function while other browser work can continue.'],
      ['Prevent a layout jump.', 'Why provide width and height attributes for an image?', 'To reserve its aspect ratio before it loads', 'To encrypt the image', 'To force it to load first', 'To remove its alt text', 'Known image dimensions let the browser reserve space and reduce layout shifts.'],
      ['Create a two-dimensional gallery.', 'Which CSS layout directly defines both rows and columns?', 'CSS Grid', 'Text decoration', 'Float only', 'Font weight', 'Grid provides explicit rows and columns for two-dimensional layouts.'],
      ['Check a fetch response.', 'Does fetch reject its promise just because the server returns HTTP 404?', 'No; check response.ok or response.status', 'Yes, always', 'Only if the response is JSON', 'It automatically retries forever', 'fetch can resolve for HTTP error responses; the application must check their status.'],
      ['Resolve two style rules.', 'With equal origin, layer, and specificity, which normal CSS declaration wins?', 'The one appearing later', 'The shorter declaration', 'The one with fewer spaces', 'The first one always', 'Source order breaks the tie when the earlier cascade factors are equal.']
    ]
  },
  'back-end': {
    beginner: [
      ['Welcome a new visitor.', 'What is a web server’s main role?', 'Receive requests and send responses', 'Choose a monitor’s brightness', 'Style text with CSS', 'Replace the user’s keyboard', 'A web server receives client requests and responds with content or data.'],
      ['Save the club roster.', 'What is a database used for?', 'Storing and querying organized data', 'Drawing page borders', 'Choosing fonts', 'Resizing a browser', 'Databases organize data so applications can retrieve and update it.'],
      ['Connect the event calendar.', 'What does an API let applications do?', 'Communicate through a defined interface', 'Automatically fix every bug', 'Replace all databases', 'Work without any code', 'An API defines how software can request data or operations from other software.'],
      ['Send event details.', 'Which format commonly represents structured data in web APIs?', 'JSON', 'JPEG', 'MP3', 'CSS', 'JSON represents values such as objects, arrays, strings, and numbers.'],
      ['Request the event list.', 'Which HTTP method is normally used to retrieve data?', 'GET', 'DELETE', 'PATCH', 'POST', 'GET requests a representation of a resource without intending to change it.'],
      ['Explain a missing page.', 'What does HTTP status 404 usually mean?', 'The requested resource was not found', 'The request succeeded', 'The password is strong', 'The server saved a new record', '404 indicates that the server could not find the requested resource.'],
      ['Check who is signing in.', 'What is authentication?', 'Verifying a user’s identity', 'Choosing a page color', 'Compressing an image', 'Sorting an array', 'Authentication checks who a user is, for example with a password or passkey.'],
      ['Protect data in transit.', 'What does HTTPS add to HTTP?', 'An encrypted connection using TLS', 'Unlimited storage', 'Automatic bug fixes', 'A guarantee that all content is true', 'HTTPS protects data in transit; it does not guarantee that a site’s content is trustworthy.']
    ],
    intermediate: [
      ['Create a new club event.', 'Which HTTP method is commonly used to submit a new resource?', 'POST', 'GET', 'HEAD', 'OPTIONS', 'POST submits data for processing and is often used to create a resource.'],
      ['Find members in a table.', 'Which SQL statement reads rows from a database?', 'SELECT', 'DELETE', 'DROP', 'INSERT', 'SELECT retrieves data; a WHERE clause can filter which rows are returned.'],
      ['Identify each member.', 'What is the purpose of a primary key?', 'Uniquely identify a row', 'Store the page background color', 'Encrypt the whole database', 'Allow duplicate identifiers', 'A primary key gives each row a unique, non-null identifier.'],
      ['Check a submitted age.', 'Where must the app validate user input for security?', 'On the server, even if the browser also checks it', 'Only in CSS', 'Only in the browser', 'Nowhere if a label exists', 'Browser checks can be bypassed, so the server must validate incoming data.'],
      ['Recognize a successful request.', 'What does HTTP status 200 normally indicate?', 'The request succeeded', 'The resource was not found', 'The server crashed', 'A redirect is required', '200 OK indicates successful handling of the request.'],
      ['Read an incoming JSON string.', 'Which JavaScript method converts a JSON string into a value?', 'JSON.parse()', 'JSON.stringify()', 'Math.floor()', 'Array.sort()', 'JSON.parse reads JSON text and creates the corresponding JavaScript value.'],
      ['Restrict editing to club leaders.', 'What is authorization?', 'Checking which actions a user is allowed to perform', 'Checking screen size', 'Formatting a password field', 'Downloading a stylesheet', 'Authorization controls permissions after identity is established.'],
      ['Respond to a server failure.', 'Which status code indicates an unexpected server error?', '500', '200', '201', '301', '500 Internal Server Error indicates that the server could not complete the request.']
    ],
    advanced: [
      ['Store passwords safely.', 'Which approach is appropriate for storing passwords?', 'Use a dedicated password hashing algorithm with a unique salt', 'Save the plain text', 'Use Base64 encoding only', 'Put them in a public JSON file', 'Password hashing algorithms such as Argon2 are designed to make password guessing expensive.'],
      ['Use a submitted search term.', 'What helps prevent SQL injection?', 'Parameterized queries', 'Joining input directly into SQL text', 'Hiding the submit button', 'Using a larger font', 'Parameters keep user-supplied values separate from the SQL command structure.'],
      ['Reserve the last event seat.', 'Why use a database transaction for related updates?', 'To commit them together or roll them back on failure', 'To turn SQL into HTML', 'To skip validation', 'To remove all backups', 'Transactions help ensure related changes succeed together or are undone together.'],
      ['Speed up repeated event reads.', 'What is a cache?', 'A stored copy of data used to serve future requests faster', 'A permanent guarantee of fresh data', 'A replacement for all security', 'An HTML heading', 'A cache can reduce repeated work, but its data may need refreshing.'],
      ['Protect an endpoint from overuse.', 'What does rate limiting do?', 'Limits requests over a time period', 'Guarantees zero bugs', 'Removes authentication', 'Makes every response larger', 'Rate limits help control load and abuse by limiting how often requests are accepted.'],
      ['Explain a blocked browser API call.', 'What does CORS control?', 'Which other origins a browser may allow to read a response', 'Which SQL table stores users', 'How passwords are hashed', 'Whether a server needs validation', 'CORS uses response headers to control browser access across origins; it is not authentication.'],
      ['Process a request twice.', 'What does idempotent mean for an operation’s intended effect?', 'Repeating it has the same effect as doing it once', 'It always completes instantly', 'It never needs authentication', 'It cannot fail', 'Idempotence describes the resulting effect, not identical responses or guaranteed success.'],
      ['Look up members by email.', 'What tradeoff can a database index introduce?', 'Faster matching reads but extra storage and write work', 'Free speed for all operations', 'Automatic encryption of all rows', 'No need for primary keys', 'Indexes can speed up lookups but need space and maintenance when data changes.']
    ]
  },
  general: { beginner: [
    ['Decode a memory glitch.', 'What is a variable used for?', 'Holding a value that code can use', 'Only changing text color', 'Deleting the program', 'Connecting a monitor', 'A variable gives a name to a value so code can refer to it.'],
    ['Repair a repeating task.', 'Which structure repeats a block of code?', 'A loop', 'A comment', 'A string', 'An image', 'Loops repeat work, often while a condition holds or for each item in a collection.'],
    ['Check the access gate.', 'Which statement chooses a branch based on a condition?', 'if', 'return only', 'A comment', 'import only', 'An if statement runs its branch when a condition is true.'],
    ['Package a useful action.', 'What is a function?', 'A reusable block of code that can be called', 'Only a kind of image', 'A computer screen', 'A file extension', 'Functions group behavior and may accept inputs and return a result.'],
    ['Restore a collection.', 'Which structure stores an ordered collection of items in JavaScript?', 'An array', 'A boolean', 'A number', 'A comment', 'Arrays store ordered items that can be accessed by index.'],
    ['Find the first item.', 'What is the first index in a JavaScript array?', '0', '1', '-1', '10', 'JavaScript arrays use zero-based indexing.'],
    ['Inspect a condition.', 'Which two values can a boolean have?', 'true and false', 'up and down', 'start and finish', 'small and large', 'Booleans represent true or false and are useful for conditions.'],
    ['Trace a hidden bug.', 'What is debugging?', 'Finding and fixing defects in code', 'Adding random changes', 'Deleting every comment', 'Ignoring error messages', 'Debugging involves observing a problem, locating its cause, and testing a fix.'],
    ['Write a helpful note.', 'What is a code comment for?', 'Explaining code to readers', 'Always running a command', 'Storing a secure password', 'Speeding up every loop', 'Comments document code for people and are not executed as program statements.'],
    ['Calculate a new total.', 'What is the value of 3 + 2 * 4?', '11', '20', '14', '9', 'Multiplication happens before addition: 2 × 4 is 8, then 3 + 8 is 11.'],
    ['Return a mission result.', 'What does return do inside a JavaScript function?', 'Ends the function call and optionally provides a value', 'Restarts the browser', 'Always repeats the function', 'Deletes the function', 'return passes control back to the caller and can provide a result.'],
    ['Plan the repair.', 'What is an algorithm?', 'A sequence of steps for solving a problem', 'A specific brand of computer', 'Only a programming language', 'A type of monitor', 'Algorithms describe steps that transform inputs into a result.']
  ]}
};
export const questions = Object.entries(bank).flatMap(([category, levels]) =>
  Object.entries(levels).flatMap(([difficulty, rows]) => rows.map(([scenario, question, ...rest], index) => ({
    id: `${category}-${difficulty}-${index + 1}`, category, difficulty, scenario, question,
    options: rest.slice(0, 4), answer: 0, explanation: rest[4]
  })))
);
