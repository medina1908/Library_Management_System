const HistoryService = {
    init: function() {
        console.log('HistoryService.init() called');
        
        const tableBody = document.getElementById('historyTableBody');
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (!tableBody || !refreshBtn) {
            console.error('History elements not found!');
            return;
        }
        
        this.loadHistory();
        this.setupRefresh();
    },

    loadHistory: function() {
        const tableBody = document.getElementById('historyTableBody');
        
        if (!tableBody) {
            console.error('historyTableBody not found!');
            return;
        }
        
        $.ajax({
            url: Constants.PROJECT_BASE_URL() + "borrow",
            type: "GET",
            dataType: "json",
            success: function(res) {
                console.log('Borrows received:', res);
                
                const borrows = Array.isArray(res) ? res : (res.data || []);
                
                tableBody.innerHTML = '';
                
                if (borrows.length === 0) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="6" class="no-data">
                                <i class="bi bi-inbox"></i>
                                <h4>No borrow history</h4>
                                <p>No books have been borrowed yet.</p>
                            </td>
                        </tr>
                    `;
                    return;
                }
                
                borrows.forEach(function(borrow, index) {
                    const row = document.createElement('tr');
                    
                    const userName = borrow.user_name || borrow.username || `User #${borrow.user_id}`;
                    const bookTitle = borrow.book_title || borrow.book_name || `Book #${borrow.book_id}`;
                    
                    const borrowDate = borrow.borrow_date ? 
                        new Date(borrow.borrow_date).toLocaleDateString('en-US') : '-';
                    const returnDate = borrow.return_date ? 
                        new Date(borrow.return_date).toLocaleDateString('en-US') : '-';
                    
                    let statusBadge = '';
                    const status = borrow.status ? borrow.status.toLowerCase() : '';
                    
                    if (status === 'returned') {
                        statusBadge = '<span class="badge bg-success">Returned</span>';
                    } else if (status === 'borrowed') {
                        if (borrow.due_date) {
                            const dueDate = new Date(borrow.due_date);
                            const today = new Date();
                            
                            if (today > dueDate) {
                                statusBadge = '<span class="badge bg-danger">Overdue</span>';
                            } else {
                                statusBadge = '<span class="badge bg-warning">Borrowed</span>';
                            }
                        } else {
                            statusBadge = '<span class="badge bg-warning">Borrowed</span>';
                        }
                    } else if (status === 'overdue') {
                        statusBadge = '<span class="badge bg-danger">Overdue</span>';
                    } else {
                        statusBadge = '<span class="badge bg-secondary">Unknown</span>';
                    }
                    
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${userName}</td>
                        <td>${bookTitle}</td>
                        <td>${borrowDate}</td>
                        <td>${returnDate}</td>
                        <td>${statusBadge}</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                console.log('History loaded:', borrows.length, 'records');
            },
            error: function(err) {
                console.error("Error fetching history:", err);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger">
                            <strong>Error!</strong> Could not load borrow history.
                        </td>
                    </tr>
                `;
            }
        });
    },

    setupRefresh: function() {
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (!refreshBtn) {
            console.error('refreshBtn not found!');
            return;
        }
        
        const self = this;
        
        refreshBtn.addEventListener('click', function() {
            console.log('Refreshing history...');
            
            refreshBtn.innerHTML = '🔄 Refreshing...';
            refreshBtn.disabled = true;
            
            self.loadHistory();
            
            setTimeout(function() {
                refreshBtn.innerHTML = '🔄 Refresh';
                refreshBtn.disabled = false;
            }, 1000);
        });
    }
};