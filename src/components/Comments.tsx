import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { lighten } from 'polished';
import { colors } from '../styles/colors';
import config from '../website-config';

interface Comment {
  id: string;
  name: string;
  password: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}

interface CommentsProps {
  slug: string;
}

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

const Comments: React.FC<CommentsProps> = ({ slug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [passwordInput, setPasswordInput] = useState<{ [id: string]: string }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);

  const isAdmin = githubUser?.login === config.adminGithubUsername;
  const storageKey = `comments_${slug}`;

  const handleOAuthMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'github-oauth-code') {
      const code = event.data.code;
      fetch('/.netlify/functions/github-auth', {
        method: 'POST',
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.login) {
            const user: GitHubUser = {
              login: data.login,
              avatar_url: data.avatar_url,
              name: data.name,
            };
            setGithubUser(user);
            sessionStorage.setItem('github_user', JSON.stringify(user));
          }
        })
        .catch(() => {
          alert('GitHub 로그인에 실패했습니다.');
        });
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      }
      const savedUser = sessionStorage.getItem('github_user');
      if (savedUser) {
        setGithubUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    }

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [storageKey, handleOAuthMessage]);

  const handleGitHubLogin = () => {
    const redirectUri = `${config.siteUrl}/github-callback`;
    const authUrl = `${GITHUB_AUTH_URL}?client_id=${config.githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;
    const popup = window.open(authUrl, 'github-oauth', 'width=600,height=700');
    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  };

  const handleGitHubLogout = () => {
    setGithubUser(null);
    sessionStorage.removeItem('github_user');
  };

  const saveComments = (updated: Comment[]) => {
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || !content.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      password: password.trim(),
      content: content.trim(),
      isPrivate,
      createdAt: new Date().toISOString(),
    };

    saveComments([...comments, newComment]);
    setContent('');
    setIsPrivate(false);
  };

  const handleReveal = (id: string) => {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    if (passwordInput[id] === comment.password) {
      setRevealedIds(prev => new Set(prev).add(id));
      setPasswordInput(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleAdminDelete = (id: string) => {
    saveComments(comments.filter(c => c.id !== id));
  };

  const handleDelete = (id: string) => {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    if (deletePassword === comment.password) {
      saveComments(comments.filter(c => c.id !== id));
      setDeleteConfirm(null);
      setDeletePassword('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <CommentsSection>
      <CommentsTitleRow>
        <CommentsTitle>
          댓글 <CommentCount>{comments.length}</CommentCount>
        </CommentsTitle>
        {githubUser ? (
          <AdminBadgeRow>
            <GitHubAvatar src={githubUser.avatar_url} alt={githubUser.login} />
            <GitHubName>{githubUser.login}</GitHubName>
            {isAdmin && <AdminBadge>관리자</AdminBadge>}
            <AdminLogoutBtn onClick={handleGitHubLogout}>로그아웃</AdminLogoutBtn>
          </AdminBadgeRow>
        ) : (
          <GitHubLoginBtn onClick={handleGitHubLogin}>
            <GitHubIcon viewBox="0 0 16 16" width="16" height="16">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </GitHubIcon>
            GitHub 로그인
          </GitHubLoginBtn>
        )}
      </CommentsTitleRow>

      <CommentList>
        {comments.map(comment => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentAuthor>
                {comment.name}
                {comment.isPrivate && <PrivateBadge>비밀글</PrivateBadge>}
              </CommentAuthor>
              <CommentMeta>
                <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                {isAdmin ? (
                  <DeleteLink onClick={() => handleAdminDelete(comment.id)}>삭제</DeleteLink>
                ) : deleteConfirm === comment.id ? (
                  <DeleteForm>
                    <DeleteInput
                      type="password"
                      placeholder="비밀번호"
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleDelete(comment.id)}
                    />
                    <DeleteBtn onClick={() => handleDelete(comment.id)}>확인</DeleteBtn>
                    <DeleteBtn onClick={() => { setDeleteConfirm(null); setDeletePassword(''); }}>취소</DeleteBtn>
                  </DeleteForm>
                ) : (
                  <DeleteLink onClick={() => setDeleteConfirm(comment.id)}>삭제</DeleteLink>
                )}
              </CommentMeta>
            </CommentHeader>
            {comment.isPrivate && !isAdmin && !revealedIds.has(comment.id) ? (
              <PrivateContent>
                <PrivateIcon>🔒</PrivateIcon>
                <span>비밀 댓글입니다.</span>
                <RevealForm>
                  <RevealInput
                    type="password"
                    placeholder="비밀번호 입력"
                    value={passwordInput[comment.id] || ''}
                    onChange={e => setPasswordInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleReveal(comment.id)}
                  />
                  <RevealBtn onClick={() => handleReveal(comment.id)}>확인</RevealBtn>
                </RevealForm>
              </PrivateContent>
            ) : (
              <CommentBody>{comment.content}</CommentBody>
            )}
          </CommentItem>
        ))}
        {comments.length === 0 && (
          <EmptyMessage>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</EmptyMessage>
        )}
      </CommentList>

      <CommentForm onSubmit={handleSubmit}>
        <FormRow>
          <FormField>
            <FormLabel>이름</FormLabel>
            <FormInput
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름"
              required
            />
          </FormField>
          <FormField>
            <FormLabel>비밀번호</FormLabel>
            <FormInput
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </FormField>
        </FormRow>
        <FormTextarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          rows={4}
          required
        />
        <FormFooter>
          <PrivateToggle>
            <PrivateCheckbox
              type="checkbox"
              id="private-toggle"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
            />
            <PrivateLabel htmlFor="private-toggle">
              <LockIcon>{isPrivate ? '🔒' : '🔓'}</LockIcon>
              비밀글
            </PrivateLabel>
          </PrivateToggle>
          <SubmitButton type="submit">댓글 작성</SubmitButton>
        </FormFooter>
      </CommentForm>
    </CommentsSection>
  );
};

export default Comments;

const CommentsSection = styled.section`
  margin: 0 auto;
  padding: 40px 170px 60px;
  max-width: 1040px;

  @media (max-width: 1170px) {
    padding: 40px 11vw 60px;
  }
  @media (max-width: 800px) {
    padding: 30px 5vw 40px;
  }
  @media (max-width: 500px) {
    padding: 20px 0 30px;
  }
`;

const CommentsTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${colors.darkgrey};
  padding-bottom: 12px;
  margin-bottom: 24px;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const CommentsTitle = styled.h2`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 600;
  color: ${colors.darkgrey};

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const GitHubLoginBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #fff;
  background: #24292e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1a1e22;
  }
`;

const GitHubIcon = styled.svg`
  fill: #fff;
`;

const AdminBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GitHubAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const GitHubName = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
  color: ${colors.darkgrey};

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const AdminBadge = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: ${colors.blue};
  padding: 2px 8px;
  border-radius: 4px;
`;

const AdminLogoutBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${colors.midgrey};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${colors.red};
  }
`;

const CommentCount = styled.span`
  color: ${colors.blue};
  font-weight: 700;
`;

const CommentList = styled.div`
  margin-bottom: 32px;
`;

const CommentItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${lighten('0.12', colors.lightgrey)};

  &:first-of-type {
    padding-top: 0;
  }

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const CommentAuthor = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.darkgrey};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const PrivateBadge = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  background: ${colors.midgrey};
  padding: 2px 8px;
  border-radius: 3px;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CommentDate = styled.span`
  font-size: 1.2rem;
  color: ${colors.midgrey};
`;

const DeleteLink = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${colors.midgrey};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${colors.red};
  }
`;

const DeleteForm = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DeleteInput = styled.input`
  width: 100px;
  padding: 3px 8px;
  font-size: 1.1rem;
  border: 1px solid ${colors.lightgrey};
  border-radius: 3px;
  outline: none;

  @media (prefers-color-scheme: dark) {
    background: ${lighten('0.05', colors.darkmode)};
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const DeleteBtn = styled.button`
  padding: 3px 8px;
  font-size: 1.1rem;
  background: ${colors.whitegrey};
  border: 1px solid ${colors.lightgrey};
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: ${colors.lightgrey};
  }

  @media (prefers-color-scheme: dark) {
    background: ${lighten('0.1', colors.darkmode)};
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const CommentBody = styled.div`
  font-size: 1.5rem;
  line-height: 1.7;
  color: ${lighten('0.1', colors.darkgrey)};
  white-space: pre-wrap;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const PrivateContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.4rem;
  color: ${colors.midgrey};
  font-style: italic;
  flex-wrap: wrap;
`;

const PrivateIcon = styled.span`
  font-style: normal;
`;

const RevealForm = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
`;

const RevealInput = styled.input`
  width: 120px;
  padding: 4px 8px;
  font-size: 1.2rem;
  border: 1px solid ${colors.lightgrey};
  border-radius: 3px;
  outline: none;

  &:focus {
    border-color: ${colors.blue};
  }

  @media (prefers-color-scheme: dark) {
    background: ${lighten('0.05', colors.darkmode)};
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const RevealBtn = styled.button`
  padding: 4px 10px;
  font-size: 1.2rem;
  background: ${colors.whitegrey};
  border: 1px solid ${colors.lightgrey};
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: ${colors.lightgrey};
  }

  @media (prefers-color-scheme: dark) {
    background: ${lighten('0.1', colors.darkmode)};
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const EmptyMessage = styled.p`
  font-size: 1.4rem;
  color: ${colors.midgrey};
  text-align: center;
  padding: 40px 0;
`;

const CommentForm = styled.form`
  background: ${colors.whitegrey};
  border-radius: 8px;
  padding: 24px;

  @media (prefers-color-scheme: dark) {
    background: ${lighten('0.05', colors.darkmode)};
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const FormField = styled.div`
  flex: 1;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.darkgrey};
  margin-bottom: 4px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 1.4rem;
  border: 1px solid ${colors.lightgrey};
  border-radius: 5px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.blue};
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.darkmode};
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 1.4rem;
  line-height: 1.6;
  border: 1px solid ${colors.lightgrey};
  border-radius: 5px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 12px;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.blue};
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.darkmode};
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrivateToggle = styled.div`
  display: flex;
  align-items: center;
`;

const PrivateCheckbox = styled.input`
  display: none;
`;

const PrivateLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.4rem;
  color: ${colors.midgrey};
  cursor: pointer;
  user-select: none;

  &:hover {
    color: ${colors.darkgrey};
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  }
`;

const LockIcon = styled.span`
  font-size: 1.5rem;
`;

const SubmitButton = styled.button`
  padding: 8px 24px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  background: ${colors.blue};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;
