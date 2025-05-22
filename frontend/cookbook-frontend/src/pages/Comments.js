import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './Comments.css';

const checkToken = (setError) => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError('You need to log in to perform this action.');
        return null; // Zwracamy null, jeśli token nie istnieje
    }
    console.log('Token is available:', token);  // Logowanie tokenu w przypadku, gdy jest dostępny
    return token;
};

const Comments = () => {
    const { recipeId } = useParams();   // Recipe/comment ID from URL
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [recipeName, setRecipeName] = useState(""); // Add state for name of recipe
    const [newComment, setNewComment] = useState(""); // New comment content
    const [editingComment, setEditingComment] = useState(null); // Current comment being edited
    const [editContent, setEditContent] = useState(""); // Edit content
    const [commentToDelete, setCommentToDelete] = useState(null); // For delete confirmation
    const [translatedComments, setTranslatedComments] = useState({});
    const [showTranslated, setShowTranslated] = useState({});
    const [error, setError] = useState(null);

    const lang = localStorage.getItem('lang') || 'en';

        useEffect(() => {
            const fetchComments = async () => {
                try {
                    const response = await axios.get(`/api/recipe/${recipeId}/comments/`);
                    const fetchedComments = response.data.comments;

                    // Posortowanie komentarzy: pierwszy komentarz autora
                    const sortedComments = fetchedComments.sort((a, b) => {
                        if (a.user === parseInt(localStorage.getItem('user_id'))) return -1;
                        if (b.user === parseInt(localStorage.getItem('user_id'))) return 1;
                        return 0;
                    });
                    setComments(sortedComments);
                    setRecipeName(response.data.recipe_name); // Set recipe name

                    if (lang !== 'en') {
                        for (let comment of fetchedComments) {
                            fetchTranslation(comment.id);
                        }
                    }
                } catch (error) {
                    setError('Failed to load comments.');
                    console.error(error);
                }
            };

            fetchComments();
        }, [recipeId, lang]);

        const fetchTranslation = async (commentId) => {
            try {
                const response = await axios.get(
                    `/api/recipe/${recipeId}/comments/${commentId}/?to=${lang}`
                );
                setTranslatedComments(prev => ({
                    ...prev,
                    [commentId]: response.data.translated
                }));
            } catch (error) {
                console.error("Translation failed:", error);
                setTranslatedComments(prev => ({
                    ...prev,
                    [commentId]: "[Translation unavailable]"
                }));
            }
        };

        const handleToggleTranslation = (commentId) => {
            setShowTranslated(prev => ({
                ...prev,
                [commentId]: !prev[commentId]
            }));
        };

        const handleAddComment = async () => {
            const token = checkToken(setError);
            if (!token) {
                setError('You need to log in to perform this action.');
                return;
            }
            if (newComment.trim() === '') return;

            try {
                const response = await axios.post(
                    `/api/recipe/${recipeId}/comments/`,
                    { comment: newComment },
                    { headers: { Authorization: `Token ${token}` } }
                );
                setComments([response.data, ...comments]);
                setNewComment('');
                if (lang !== 'en') {
                    fetchTranslation(response.data.id);
                }
            } catch (error) {
                console.error('Error adding comment:', error);
                if (error.response) {
                    setError(error.response.data.detail || 'An error occurred while adding the comment.');
                }
            }
        };

        const handleEditComment = async (commentId) => {
            const token = checkToken(setError);
            if (!token) return;

            try {
                const response = await axios.patch(
                    `/api/recipe/${recipeId}/comments/${commentId}/`,
                    { comment: editContent },
                    { headers: { Authorization: `Token ${token}` } }
                );
                setComments((prev) =>
                    prev.map((comment) => (comment.id === commentId ? response.data : comment))
                );
                setEditingComment(null);
            } catch (error) {
                console.error('Error editing comment:', error);
                setError('Failed to edit comment.');
            }
        };

        const handleDeleteComment = async (commentId) => {
            const token = checkToken(setError);
            if (!token) return;

            try {
                await axios.delete(`/api/recipe/${recipeId}/comments/${commentId}/`,
                    { headers: { Authorization: `Token ${token}` } }
                );
                setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    setError('You can only delete your own comments.');
                } else {
                    console.error('Error deleting comment:', error);
                    setError('Failed to delete comment.');
                }
            }
        };

        if (error) {
            return <p className="error">{error}</p>;
        }

        return (
            <div className="comments-page">
                <button onClick={() => navigate(`/recipe/${recipeId}`)} className="back-button">
                    Back to Recipe Details
                </button>
                <h1>Comments for: {recipeName}</h1>
                <div className="add-comment">
                    <textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Post Comment</button>
                </div>
                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <p>{comment.user} on {new Date(comment.created_on).toLocaleDateString()}</p>
                                {editingComment === comment.id ? (
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="edit-comment-textarea"
                                    />
                                ) : (
                                    <>
                                        <p>{comment.comment}</p>
                                        {translatedComments[comment.id] && (
                                            <>
                                                <button onClick={() => handleToggleTranslation(comment.id)}>
                                                    {showTranslated[comment.id] ? 'Hide Translation' : 'Show Translation'}
                                                </button>
                                                {showTranslated[comment.id] && (
                                                    <p className="translated-comment">
                                                        🈯 {translatedComments[comment.id]}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                                {comment.user_id === parseInt(localStorage.getItem('user_id')) && (
                                    <div className="comment-actions">
                                        {editingComment === comment.id ? (
                                            <>
                                                <button onClick={() => handleEditComment(comment.id)}>Save changes</button>
                                                <button onClick={() => setEditingComment(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => {
                                                    setEditingComment(comment.id);
                                                    setEditContent(comment.comment);
                                                }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments available for this recipe.</p>
                    )}
                </div>
                {commentToDelete && (
                    <div className="delete-confirmation-modal">
                        <p>Are you sure you want to delete this comment?</p>
                        <button onClick={handleDeleteComment}>Yes</button>
                        <button onClick={() => setCommentToDelete(null)}>No</button>
                    </div>
                )}
            </div>
        );
    };

export default Comments;