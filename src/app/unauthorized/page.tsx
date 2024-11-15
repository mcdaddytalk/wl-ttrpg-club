import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <>
            <h1>Unauthorized</h1>
            <p>Sorry, You are not authorized to view this page</p>
            <Link href="/">Return Home</Link>
        </>
    )
}