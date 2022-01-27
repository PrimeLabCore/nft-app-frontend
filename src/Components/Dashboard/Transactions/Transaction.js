import React from 'react';
import moment from 'moment';
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import homeStyles from '../Home/Home.module.css';
import transactionStyles from './transactions.module.css';

export default function Transaction({ data, user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const styles = pathname === '/transactions' ? transactionStyles : homeStyles;

  const openClaim = (data) => {
    dispatch({ type: 'nft__detail', payload: data });
    navigate('/nft/detail/claim');
  };

  const renderByTransactionType = () => {
    switch (data.type) {
      case 'create_wallet':
        return (
          <h6>
            <span>{user.wallet_id}</span>
            <br />
            Your wallet was created
          </h6>
        );
      case 'mine_nft':
        return (
          <h6>
            <span>{user.wallet_id}</span>
            <br />
            created an NFT -
            {' '}
            <a
              href={`/nft/${data.transaction_item_id}`}
              className={styles.transaction__name}
            >
              {`#${data.transaction_item_id}`}
            </a>
          </h6>
        );
      case 'unclaimed':
        return (
          <h6>
            <span>{user.wallet_id}</span>
            <br />
            {'sent an NFT - '}
            <a
              href={`/nft/${data.transaction_item_id}`}
              className={styles.transaction__name}
            >
              {`#${data.transaction_item_id}`}
            </a>
            <br />
            {' to '}
            <span
              className={styles.transaction__name}
            >
              {data.counterparty?.[0]?.email
                ? data.counterparty?.[0]?.email
                : data.counterparty?.[0]?.phone}
            </span>
          </h6>
        );
      case 'transfer_nft':
        return (
          <h6>
            {'An NFT - '}
            <a
              href={`/nft/${data.transaction_item_id}`}
              className={styles.transaction__name}
            >
              {`# ${data.transaction_item_id}`}
            </a>
            <br />
            {' was claimed '}
          </h6>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={styles.transaction__list}
      onClick={() => !data.sender && openClaim(data)}
    >
      <div className={styles.transaction__action}>
        <div className={styles.icon__wrapper}>
          {data.sender ? (
            <BsArrowUpRight />
          ) : (
            <BsArrowDownLeft />
          )}
        </div>
        {renderByTransactionType()}
      </div>
      <div className={styles.transaction__time}>
        {/* <p>{data.formattedtime}</p> */}
        <p>
          {moment
            .utc(data.created)
            .local()
            .startOf('seconds')
            .fromNow()}
        </p>
      </div>
    </div>
  );
}