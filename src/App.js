import "./App.css";
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect,
	useLocation,
	useHistory,
} from "react-router-dom";
import { useState } from "react";

const fakeAuth = {
	isAuthenticated: false,
	authenticate(cb) {
		this.isAuthenticated = true;
		setTimeout(cb, 100);
	},
	signOut(cb) {
		this.isAuthenticated = false;
		setTimeout(cb, 100);
	},
};

const Public = () => {
	return (
		<div>
			<h3>Public</h3>
		</div>
	);
};

const Protected = () => {
	return (
		<div>
			<h3>Protected</h3>
		</div>
	);
};

function Login() {
	const [redirectToReferrer, setRedirectToReferrer] = useState(false);
	const { state } = useLocation();
	const login = () => {
		fakeAuth.authenticate(() => {
			setRedirectToReferrer(true);
		});
	};

	if (redirectToReferrer === true) {
		// return <Redirect to="/" />;
		// pathname:'/login',
		// state:
		return <Redirect to={state?.from || "/"} />;
	}

	return (
		<div>
			<h4>You must LOGIN to view this page</h4>
			<button onClick={login}>Login</button>
		</div>
	);
}

function PrivateRoute({ children, ...rest }) {
	// <Route {...rest}>
	//   {children}
	// </Route>

	return (
		<Route
			{...rest}
			render={() => {
				return fakeAuth.isAuthenticated === true ? (
					children
				) : (
					<Redirect
						to="/login"
						// to={{
						// 	pathname: "/login",
						// 	state: { from: location },
						// }}
					/>
				);
			}}
		/>
	);
}

function AuthButton() {
	const history = useHistory();
	return fakeAuth.isAuthenticated === true ? (
		<p>
			Welcome !{" "}
			<button onClick={() => fakeAuth.signOut(() => history.push("/"))}>
				Sign Out
			</button>{" "}
		</p>
	) : (
		<p>You are not Signed In</p>
	);
}

function App() {
	return (
		<Router>
			<div className="App">
				<h1 style={{ color: "white" }}>Protected Routes</h1>
				<AuthButton />
				<ul>
					<li style={{ listStyle: "none", textDecoration: "none" }}>
						<Link style={{ color: "yellow" }} to="/public">
							Public Page
						</Link>
					</li>
					<li style={{ listStyle: "none", textDecoration: "none" }}>
						<Link style={{ color: "yellow" }} to="/protected">
							Protected page
						</Link>
					</li>
				</ul>
				<Route path="/public">
					<Public />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<PrivateRoute path="/protected">
					<Protected />
				</PrivateRoute>
			</div>
		</Router>
	);
}

export default App;
