import MembersModalContainer from '@Components/Dialogs/PmToolsModal/Member';
import { PanelTextField } from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import {
  selectMembers,
  selectSearch,
  selectSearchLoader,
} from '@Redux/pmtools/invite/selectors';
import { ModalAction } from '@Src/types/types';
import { MemberData } from '@Src/types/pmtools/types';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTokenPair } from '@Redux/user/selectors';
import {
  clearSearch,
  requestSearchAction,
} from '@Redux/pmtools/invite/actions/search';
import SearchMember from './SearchMember';

const Search = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const { access } = useSelector(selectTokenPair);
  const searchResult = useSelector(selectSearch);
  const members = useSelector(selectMembers);
  const loader = useSelector(selectSearchLoader);

  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(requestSearchAction({ search, access }));
  };

  const handleClearSearch = () => {
    setSearch('');
    dispatch(clearSearch());
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  useEffect(() => {
    if (searchResult) {
      const disabled = !!members.find(
        (m: MemberData) => m.user_id === searchResult.id,
      );
      setDisabled(disabled);
    }
  }, [searchResult, members]);

  return (
    <>
      <h2 style={{ marginBottom: 0 }}>Search</h2>
      <form onSubmit={searchHandler}>
        <PanelTextField
          placeholder="Search"
          value={search}
          onChange={changeHandler}
          required
        />
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          style={{ marginRight: 5 }}
        >
          Search
        </Button>
        <Button
          color="secondary"
          variant="contained"
          disabled={!search}
          onClick={handleClearSearch}
        >
          Clear
        </Button>
      </form>
      {loader && <p>Loading...</p>}
      {searchResult && (
        <>
          <SearchMember
            user={searchResult}
            setAddMember={setAddMember}
            isDisabled={isDisabled}
            setDisabled={setDisabled}
          />
          <MembersModalContainer
            member={searchResult}
            show={addMember}
            hide={() => setAddMember(false)}
            action={ModalAction.Create}
            setSearch={setSearch}
          />
        </>
      )}
    </>
  );
};

export default Search;
